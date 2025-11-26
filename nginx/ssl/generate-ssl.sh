#!/bin/bash

# SSL Certificate Generator for Nganiriza
# This script generates self-signed SSL certificates for development/testing
# For production, use certificates from a trusted CA (e.g., Let's Encrypt)

set -e

# Configuration
DOMAIN="${1:-localhost}"
DAYS_VALID=365
SSL_DIR="$(dirname "$0")"

echo "🔐 Generating SSL certificates for: $DOMAIN"
echo "📁 Output directory: $SSL_DIR"

# Generate private key
openssl genrsa -out "$SSL_DIR/private.key" 2048

# Generate certificate signing request (CSR)
openssl req -new -key "$SSL_DIR/private.key" -out "$SSL_DIR/certificate.csr" \
    -subj "/C=RW/ST=Kigali/L=Kigali/O=Nganiriza/OU=Development/CN=$DOMAIN"

# Generate self-signed certificate
openssl x509 -req -days $DAYS_VALID \
    -in "$SSL_DIR/certificate.csr" \
    -signkey "$SSL_DIR/private.key" \
    -out "$SSL_DIR/certificate.crt" \
    -extfile <(printf "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN,IP:127.0.0.1")

# Clean up CSR (not needed after certificate is generated)
rm -f "$SSL_DIR/certificate.csr"

# Set proper permissions
chmod 600 "$SSL_DIR/private.key"
chmod 644 "$SSL_DIR/certificate.crt"

echo ""
echo "✅ SSL certificates generated successfully!"
echo ""
echo "Files created:"
echo "  - $SSL_DIR/certificate.crt (SSL Certificate)"
echo "  - $SSL_DIR/private.key (Private Key)"
echo ""
echo "Certificate valid for: $DAYS_VALID days"
echo ""
echo "⚠️  Note: This is a self-signed certificate for development/testing."
echo "    Browsers will show a security warning. For production, use:"
echo "    - Let's Encrypt (free): https://letsencrypt.org/"
echo "    - Cloudflare SSL"
echo "    - Any trusted Certificate Authority"
echo ""
echo "Next steps:"
echo "  1. Restart the nginx container: docker-compose restart nginx"
echo "  2. Access your app at: https://$DOMAIN"
