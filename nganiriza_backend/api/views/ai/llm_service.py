import hashlib
import json
from typing import Optional, Dict, Any
from llama_cpp import Llama
from django.conf import settings
from django.core.cache import cache
from models.models import QueryCache

class LLMService:
    """Singleton service for managing LLM inference"""
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._model is None:
            self._load_model()
    
    def _load_model(self):
        """Load the GGUF model with llama.cpp"""
        try:
            self._model = Llama(
                model_path=settings.AI_MODEL_PATH,
                n_ctx=settings.AI_MODEL_CONTEXT_SIZE,
                n_threads=4,
                n_gpu_layers=settings.AI_MODEL_N_GPU_LAYERS,
                verbose=False,
            )
            print("✓ LLM model loaded successfully")
        except Exception as e:
            print(f"✗ Failed to load model: {e}")
            self._model = None
    
    @staticmethod
    def _generate_cache_key(query: str, context: Dict = None) -> str:
        """Generate a unique hash for query + context"""
        content = query + json.dumps(context or {}, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()
    
    def get_cached_response(self, query: str, context: Dict = None) -> Optional[str]:
        """Retrieve cached response if available"""
        cache_key = self._generate_cache_key(query, context)
        
        # Try memory cache first (faster)
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        # Try database cache
        try:
            query_cache = QueryCache.objects.get(query_hash=cache_key)
            query_cache.accessed_count += 1
            query_cache.save(update_fields=['accessed_count', 'last_accessed'])
            
            # Store in memory cache for faster subsequent access
            cache.set(cache_key, query_cache.response)
            return query_cache.response
        except QueryCache.DoesNotExist:
            return None
    
    def cache_response(self, query: str, response: str, context: Dict = None):
        """Cache a response for offline use"""
        cache_key = self._generate_cache_key(query, context)
        
        # Store in memory cache
        cache.set(cache_key, response)
        
        # Store in database for persistence
        QueryCache.objects.update_or_create(
            query_hash=cache_key,
            defaults={
                'query_text': query,
                'response': response,
                'context': context or {},
            }
        )
    
    def generate_response(
        self,
        query: str,
        context: Dict = None,
        max_tokens: int = None,
        temperature: float = None,
        system_prompt: str = None,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """Generate AI response with caching"""
        
        # Check cache first if enabled
        if use_cache:
            cached_response = self.get_cached_response(query, context)
            if cached_response:
                return {
                    'response': cached_response,
                    'cached': True,
                    'success': True
                }
        
        # Generate new response
        if self._model is None:
            return {
                'response': 'AI model not available. Please try again later.',
                'cached': False,
                'success': False,
                'error': 'Model not loaded'
            }
        
        try:
            # Build prompt with Qwen2.5 chat template
            messages = []
            
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            if context:
                context_text = "\n".join([f"{k}: {v}" for k, v in context.items()])
                messages.append({
                    "role": "system",
                    "content": f"Context information:\n{context_text}"
                })
            
            messages.append({
                "role": "user",
                "content": query
            })
            
            # Generate response
            response = self._model.create_chat_completion(
                messages=messages,
                max_tokens=max_tokens or settings.AI_MODEL_MAX_TOKENS,
                temperature=temperature or settings.AI_MODEL_TEMPERATURE,
                stop=["<|endoftext|>", "<|im_end|>"],
            )
            
            response_text = response['choices'][0]['message']['content'].strip()
            
            # Cache the response
            if use_cache:
                self.cache_response(query, response_text, context)
            
            return {
                'response': response_text,
                'cached': False,
                'success': True,
                'tokens_used': response['usage']['total_tokens']
            }
            
        except Exception as e:
            return {
                'response': 'An error occurred while processing your request.',
                'cached': False,
                'success': False,
                'error': str(e)
            }