#!/bin/sh
set -e

echo "=================================================="
echo "=== BookStack Startup Diagnostics ==="
echo "PORT: ${PORT:-80}"
echo "APP_URL: ${APP_URL:-not set}"
echo "DB_HOST: ${DB_HOST:-not set}"
echo "DB_PORT: ${DB_PORT:-not set}"
echo "DB_DATABASE: ${DB_DATABASE:-not set}"
echo "DB_USERNAME: ${DB_USERNAME:-not set}"
echo "=================================================="

# Fix Apache MPM conflict (prevent AH00534: More than one MPM loaded)
rm -f /etc/apache2/mods-enabled/mpm_worker.load /etc/apache2/mods-enabled/mpm_worker.conf /etc/apache2/mods-enabled/mpm_event.load /etc/apache2/mods-enabled/mpm_event.conf 2>/dev/null || true
a2dismod -f mpm_worker mpm_event 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

# Auto-configure SSL CA certificate for cloud MySQL/TiDB
if [ -z "$MYSQL_ATTR_SSL_CA" ] && [ -f /etc/ssl/certs/ca-certificates.crt ]; then
    export MYSQL_ATTR_SSL_CA="/etc/ssl/certs/ca-certificates.crt"
fi

# Support dynamic PORT from cloud hosting (Railway, Render, etc.)
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf 2>/dev/null || true
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/*.conf 2>/dev/null || true

# Fix storage and cache permissions
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs storage/uploads public/uploads bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache public/uploads
chmod -R 775 storage bootstrap/cache public/uploads

# Generate /app/.env dynamically so Laravel Dotenv always has access to the container variables
echo "Generating /app/.env from container environment variables..."
cat <<EOF > /app/.env
APP_KEY=${APP_KEY}
APP_URL=${APP_URL}
APP_ENV=${APP_ENV:-production}
APP_DEBUG=${APP_DEBUG:-true}
DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
MYSQL_ATTR_SSL_CA=${MYSQL_ATTR_SSL_CA}
STORAGE_TYPE=${STORAGE_TYPE:-local}
EOF

# Run database migrations
if [ -n "$DB_HOST" ]; then
    echo "Executing database migrations..."
    php artisan migrate --force --no-interaction || echo "Warning: Migration command failed, inspect error above."
else
    echo "CRITICAL WARNING: DB_HOST is empty or unset! Migrations cannot run."
fi

echo "Starting BookStack web server on port ${PORT}..."
exec apache2-foreground
