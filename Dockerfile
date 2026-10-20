FROM php:8.3-apache

# Install system dependencies including ca-certificates for TLS/SSL database connections
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        zip \
        unzip \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libldap2-dev \
        libpng-dev \
        libzip-dev \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Configure and install required PHP extensions
RUN docker-php-ext-configure ldap --with-libdir="lib/$(gcc -dumpmachine)" && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) pdo_mysql gd ldap zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configure Apache DocumentRoot to /app/public
ENV APACHE_DOCUMENT_ROOT="/app/public"
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf && \
    a2enmod rewrite

# Allow .htaccess overrides in /app/public
RUN printf '<Directory /app/public>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/bookstack.conf && \
    a2enconf bookstack

# Ensure only mpm_prefork is active to prevent MPM conflict in PaaS
RUN a2dismod -f mpm_event mpm_worker 2>/dev/null || true && a2enmod mpm_prefork

# Use production php.ini with optimized memory, upload limits and EGPCS variables_order
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    sed -i 's/variables_order = "GPCS"/variables_order = "EGPCS"/g' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/memory_limit = 128M/memory_limit = 512M/g' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/g' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/post_max_size = 8M/post_max_size = 100M/g' "$PHP_INI_DIR/php.ini"

WORKDIR /app

# Copy application files
COPY . /app

# Install PHP dependencies without dev packages
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

# Make entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/app/docker-entrypoint.sh"]
