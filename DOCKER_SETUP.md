# Docker Setup Guide for Nganiriza

This guide explains how to run the Nganiriza application stack using Docker Compose.

## Architecture

The application consists of 3 main services:

1. **Backend** - Django REST API (Port 8000)
2. **Frontend** - React application served by Nginx (Port 3000)
3. **Ollama Service** - Kinyarwanda Counseling Model (Port 11434)

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) NVIDIA Docker runtime for GPU acceleration

## Quick Start

1. **Clone and navigate to the project directory:**
   ```bash
   cd /path/to/nganiriza_capstone
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your settings.

3. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

4. **Check service status:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f ollama1
   ```

## Service Details

### Backend Service

- **Port:** 8000
- **Health Check:** `http://localhost:8000/admin/`
- **Database:** SQLite (can be configured for PostgreSQL)
- **Static Files:** Volume mounted at `/app/staticfiles`

### Frontend Service

- **Port:** 3000 (mapped to Nginx port 80)
- **Health Check:** `http://localhost:3000/health`
- **Build:** Uses pnpm for package management
- **Production:** Served via Nginx with optimized caching

### Ollama Service

- **Ollama Service:** Port 11434 - Kinyarwanda Counseling Model
  - Uses custom model from `gemma-kinyarwanda.gguf`
  - Configured via `Modelfile`
  - Container name: `nganiriza_ollama`

## Environment Variables

Key environment variables (see `.env.example`):

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_OLLAMA_SERVICE_URL=http://localhost:11434
```

## GPU Support

If you have NVIDIA GPUs, the Ollama services will automatically use them. Ensure:

1. NVIDIA Docker runtime is installed
2. GPU is accessible: `docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi`

The docker-compose.yml includes GPU configuration for all Ollama services.

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Rebuild specific service
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Access service shell
```bash
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec ollama1 sh
```

### View service logs
```bash
docker-compose logs -f [service_name]
```

### Restart a service
```bash
docker-compose restart [service_name]
```

### Clean up volumes (⚠️ deletes data)
```bash
docker-compose down -v
```

## Database Migrations

Run Django migrations:

```bash
docker-compose exec backend python manage.py migrate
```

Create superuser:

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Troubleshooting

### Port conflicts
If ports are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Change host port
```

### Ollama model not loading
1. Check logs: `docker-compose logs ollama1`
2. Verify model files exist in `nganirza_ai/` (gemma-kinyarwanda.gguf and Modelfile)
3. Manually create model: `docker-compose exec ollama1 ollama create kinyarwanda-counseling -f /models/Modelfile`

### Frontend build fails
1. Ensure `package.json` and `pnpm-lock.yaml` are present
2. Check Node version compatibility
3. Review build logs: `docker-compose logs frontend`

### Backend static files
If static files aren't serving:
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

## Production Considerations

1. **Security:**
   - Change `SECRET_KEY` in production
   - Set `DEBUG=False`
   - Use PostgreSQL instead of SQLite
   - Configure proper CORS origins

2. **Performance:**
   - Use reverse proxy (Nginx/Traefik) in front
   - Enable SSL/TLS
   - Configure proper resource limits
   - Use production-grade WSGI server settings

3. **Monitoring:**
   - Set up health checks
   - Configure logging aggregation
   - Monitor resource usage

4. **Backup:**
   - Regular database backups
   - Volume backups for persistent data

## Network Architecture

All services communicate via the `nganiriza_network` bridge network:

- Frontend → Backend: `http://backend:8000`
- Backend → Ollama Service: `http://ollama1:11434`

## Volumes

Persistent volumes are created for:
- `backend_static` - Django static files
- `backend_media` - User uploaded media
- `ollama_data` - Model data and cache
- `ollama_models` - Model files

## Support

For issues or questions, check:
- Service logs: `docker-compose logs [service]`
- Container status: `docker-compose ps`
- Resource usage: `docker stats`

