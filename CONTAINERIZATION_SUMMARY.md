# Containerization Summary

This document summarizes the containerization setup for the Nganiriza application.

## Files Created/Modified

### Dockerfiles

1. **`nganiriza_backend/dockerfile`** (Updated)
   - Django backend container
   - Python 3.11-slim base
   - Gunicorn WSGI server
   - Fixed WSGI module path to `core.wsgi:application`

2. **`nganiriza_frontend/Dockerfile`** (New)
   - Multi-stage build for React frontend
   - Uses pnpm for package management
   - Production build served via Nginx
   - Handles both with/without pnpm-lock.yaml

3. **`nganirza_ai/Dockerfile.ollama1`** (New)
   - Ollama service for Kinyarwanda counseling model
   - Uses custom `gemma-kinyarwanda.gguf` model
   - Port 11434

### Entrypoint Scripts

1. **`nganirza_ai/entrypoint1.sh`**
   - Starts Ollama server
   - Creates model from Modelfile
   - Handles Kinyarwanda counseling model

### Configuration Files

1. **`docker-compose.yml`** (New)
   - Orchestrates all 3 services
   - Network configuration
   - Volume management
   - Health checks
   - GPU support configuration
   - Environment variable management

2. **`nganiriza_frontend/nginx.conf`** (New)
   - Nginx configuration for React SPA
   - SPA routing support
   - Static asset caching
   - Gzip compression
   - Security headers

3. **`.dockerignore`** (New)
   - Excludes unnecessary files from Docker builds
   - Reduces build context size

4. **`.env.example`** (New)
   - Template for environment variables
   - Documents required configuration

### Documentation

1. **`DOCKER_SETUP.md`** (New)
   - Comprehensive setup guide
   - Common commands
   - Troubleshooting tips
   - Production considerations

## Service Architecture

```
┌─────────────────┐
│   Frontend      │  Port 3000 (Nginx)
│   (React)       │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│   Backend       │  Port 8000 (Django)
│   (Django)      │
└────────┬────────┘
         │
┌────────▼──┐
│ Ollama    │
│ Port      │
│ 11434     │
└───────────┘
```

## Port Mapping

- **Frontend:** 3000 → 80 (container)
- **Backend:** 8000 → 8000 (container)
- **Ollama:** 11434 → 11434 (container)

## Volumes

Persistent volumes for:
- Backend static files
- Backend media files
- Ollama models and data

## Network

All services communicate via `nganiriza_network` bridge network.

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your settings

# 3. Build and start
docker-compose up -d --build

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

## Next Steps

1. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`
   - Update with your actual values
   - Set `SECRET_KEY` for Django
   - Configure email settings

2. **Run Migrations:**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Create Superuser:**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. **Verify Services:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Ollama: http://localhost:11434/api/tags

## Integration with Backend

The backend can now connect to Ollama service using:
- `OLLAMA_SERVICE_URL=http://ollama1:11434`

Update your Django settings or LLM service to use this URL instead of local model loading.

## Notes

- GPU support is configured but optional
- Models are pulled on first run (may take time)
- Health checks ensure services are ready before dependencies start
- All services restart automatically unless stopped manually

