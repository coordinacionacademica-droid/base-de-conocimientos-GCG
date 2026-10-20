#!/bin/sh
set -e

# Default configurations
APP_KEY="${APP_KEY:-base64:A+kCMJRLVEr/LTks92jFd0JTq74Lk04FYekgqpsSuyo=}"
APP_URL="${APP_URL:-https://base-de-conocimientos-gcg-production-4da7.up.railway.app}"
APP_PROXIES="${APP_PROXIES:-*}"
APP_DEBUG="${APP_DEBUG:-true}"
LOG_CHANNEL="${LOG_CHANNEL:-errorlog}"
DB_CONNECTION="${DB_CONNECTION:-mysql}"
DB_HOST="${DB_HOST:-gateway01.us-east-1.prod.aws.tidbcloud.com}"
DB_PORT="${DB_PORT:-4000}"
DB_DATABASE="${DB_DATABASE:-test}"
DB_USERNAME="${DB_USERNAME:-3n6CfkUrJM3jSZ8.root}"
DB_PASSWORD="${DB_PASSWORD:-vSZiGReW2XZqemXJ}"
STORAGE_TYPE="${STORAGE_TYPE:-local}"
ALLOWED_IFRAME_SOURCES="${ALLOWED_IFRAME_SOURCES:-https://*.google.com https://drive.google.com https://docs.google.com https://*.draw.io https://*.youtube.com https://*.youtube-nocookie.com https://*.vimeo.com}"

# Auto-correct typo if DB_HOST contains us2-east-1
DB_HOST=$(echo "$DB_HOST" | sed 's/us2-east-1/us-east-1/g')

echo "=================================================="
echo "=== BookStack Startup Diagnostics ==="
echo "PORT: ${PORT:-80}"
echo "APP_URL: ${APP_URL}"
echo "APP_PROXIES: ${APP_PROXIES}"
echo "DB_HOST: ${DB_HOST}"
echo "DB_PORT: ${DB_PORT}"
echo "DB_DATABASE: ${DB_DATABASE}"
echo "DB_USERNAME: ${DB_USERNAME}"
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

# Fix storage, session, cache and log permissions
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs storage/uploads public/uploads bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache public/uploads
chmod -R 777 storage bootstrap/cache public/uploads

# Generate /app/.env dynamically so Laravel Dotenv always has access to the configuration
echo "Generating /app/.env configuration..."
cat <<EOF > /app/.env
APP_KEY=${APP_KEY}
APP_URL=${APP_URL}
APP_PROXIES=${APP_PROXIES}
APP_ENV=${APP_ENV:-production}
APP_DEBUG=${APP_DEBUG}
LOG_CHANNEL=${LOG_CHANNEL}
DB_CONNECTION=${DB_CONNECTION}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
MYSQL_ATTR_SSL_CA=${MYSQL_ATTR_SSL_CA}
STORAGE_TYPE=${STORAGE_TYPE}
ALLOWED_IFRAME_SOURCES="${ALLOWED_IFRAME_SOURCES}"
EOF

# Run database migrations in background without blocking web server startup
(php artisan migrate --force --no-interaction 2>&1 || true) &

echo "Starting BookStack web server on port ${PORT}..."
exec apache2-foreground
