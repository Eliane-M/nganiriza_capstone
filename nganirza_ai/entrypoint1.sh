#!/bin/sh
set -e

echo "Starting Ollama Service 1 (Kinyarwanda Counseling)..."

# Set OLLAMA_HOST environment variable (Ollama reads this, not --host flag)
export OLLAMA_HOST=${OLLAMA_HOST:-0.0.0.0:11434}

# Start Ollama server in background
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "Waiting for Ollama to be ready..."
sleep 10

# Create model from Modelfile if it doesn't exist
if [ -f /models/Modelfile ] && [ -f /models/gemma-kinyarwanda.gguf ]; then
    echo "Creating kinyarwanda-counseling model from Modelfile..."
    ollama create kinyarwanda-counseling -f /models/Modelfile || echo "Model may already exist"
fi

# Wait for Ollama process
wait $OLLAMA_PID

