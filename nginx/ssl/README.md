# SSL Certificates Directory

Place your SSL certificates here when you want to enable HTTPS:

- `certificate.crt` - Your SSL certificate
- `private.key` - Your private key

## For Development (Self-signed certificate)

You can generate a self-signed certificate for development:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key \
  -out certificate.crt \
  -subj "/C=RW/ST=Kigali/L=Kigali/O=Nganiriza/CN=localhost"
```

## For Production

Use certificates from a trusted Certificate Authority (CA) like:

- Let's Encrypt (free)
- Cloudflare
- DigiCert
- etc.

## After Adding Certificates

1. Uncomment the HTTPS server block in `nginx/nginx.conf`
2. Optionally enable HTTP to HTTPS redirect
3. Restart the nginx container: `docker-compose restart nginx`
