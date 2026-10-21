import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderId = (formData.get('folderId') as string) || '';
    const customWebhook = (formData.get('webhookUrl') as string) || process.env.GOOGLE_UPLOAD_WEBHOOK_URL || '';

    if (!file || !folderId) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos: archivo y folderId.' },
        { status: 400 }
      );
    }

    // Zero-server-storage upload:
    // If a Google Apps Script Web App URL is configured, we pipe the file directly to Google Drive!
    if (customWebhook) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');

      const payload = {
        folderId,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64
      };

      const gasRes = await fetch(customWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!gasRes.ok) {
        const errText = await gasRes.text();
        return NextResponse.json(
          { success: false, error: `Error desde Google Apps Script: ${errText}` },
          { status: 502 }
        );
      }

      const result = await gasRes.json();
      return NextResponse.json({
        success: true,
        source: 'google-drive-direct',
        fileId: result.fileId,
        fileName: file.name,
        message: 'Archivo subido directamente a Google Drive con 0 MB consumidos en servidor.'
      });
    }

    // If webhook is not configured yet, return instructions
    return NextResponse.json({
      success: false,
      setupNeeded: true,
      message: 'Para subir directamente desde el navegador a Google Drive sin pasar por el disco del servidor, se requiere conectar el Webhook de Google Apps Script o usar la subida directa a Drive.',
      sampleScript: `
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var folder = DriveApp.getFolderById(data.folderId);
  var bytes = Utilities.base64Decode(data.base64);
  var blob = Utilities.newBlob(bytes, data.mimeType, data.fileName);
  var file = folder.createFile(blob);
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    url: file.getUrl()
  })).setMimeType(ContentService.MimeType.JSON);
}
      `.trim()
    });
  } catch (error: any) {
    console.error('Error en /api/upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar subida a Google Drive.' },
      { status: 500 }
    );
  }
}
