#!/bin/sh
set -e

# Fix Apache MPM conflict (prevent AH00534: More than one MPM loaded)
rm -f /etc/apache2/mods-enabled/mpm_worker.load /etc/apache2/mods-enabled/mpm_worker.conf /etc/apache2/mods-enabled/mpm_event.load /etc/apache2/mods-enabled/mpm_event.conf 2>/dev/null || true
a2dismod -f mpm_worker mpm_event 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

# Support dynamic PORT from cloud hosting (Railway, Render, etc.)
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf 2>/dev/null || true
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/*.conf 2>/dev/null || true

# Fix storage and cache permissions
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs storage/uploads public/uploads bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache public/uploads
chmod -R 775 storage bootstrap/cache public/uploads

# Run migrations if DB_HOST is set
if [ -n "$DB_HOST" ]; then
    echo "Checking and executing database migrations..."
    php artisan migrate --force --no-interaction || echo "Warning: Migration failed or database not ready yet."
fi

echo "Starting BookStack web server on port ${PORT}..."
exec apache2-foreground
