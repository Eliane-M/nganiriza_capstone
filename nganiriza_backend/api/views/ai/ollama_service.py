import requests
import json
from typing import List, Dict, Any, Optional, Tuple
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class OllamaService:
    """Service for interacting with Ollama API"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or getattr(settings, 'OLLAMA_SERVICE_URL', 'http://ollama1:11434')
        self.model_name = getattr(settings, 'OLLAMA_MODEL_NAME', 'kinyarwanda-counseling')
        self.max_context_size = 32000  # 32k tokens
        self.summarization_threshold = 0.8  # Summarize when 80% of context is used
        
    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation: ~4 characters per token"""
        return len(text) // 4
    
    def _build_messages(self, conversation_history: List[Dict], current_query: str, system_prompt: str = None) -> List[Dict]:
        """Build messages array for Ollama API"""
        messages = []
        
        # Add system prompt if provided
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        
        # Add conversation history
        for msg in conversation_history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current query
        messages.append({
            "role": "user",
            "content": current_query
        })
        
        return messages
    
    def _check_context_size(self, messages: List[Dict]) -> Tuple[bool, int]:
        """Check if context exceeds threshold and return total tokens"""
        total_text = " ".join([msg.get("content", "") for msg in messages])
        total_tokens = self._estimate_tokens(total_text)
        needs_summarization = total_tokens > (self.max_context_size * self.summarization_threshold)
        return needs_summarization, total_tokens
    
    def _summarize_conversation(self, messages: List[Dict]) -> str:
        """Summarize conversation history to reduce context size"""
        # Extract conversation content (excluding system prompts)
        conversation_text = "\n".join([
            f"{msg.get('role', 'user')}: {msg.get('content', '')}"
            for msg in messages
            if msg.get('role') != 'system'
        ])
        
        summary_prompt = f"""Please provide a concise summary of the following conversation, preserving key information and context:

{conversation_text}

Summary:"""
        
        try:
            response = self._call_ollama(
                model=self.model_name,
                prompt=summary_prompt,
                system_prompt="You are a helpful assistant that creates concise summaries of conversations.",
                max_tokens=500,
                temperature=0.3
            )
            return response.get('response', '')
        except Exception as e:
            logger.error(f"Error summarizing conversation: {e}")
            # Fallback: return first and last few messages
            if len(messages) > 4:
                return f"[Previous conversation with {len(messages)} messages]"
            return conversation_text[:500] + "..."
    
    def _call_ollama(
        self,
        model: str,
        prompt: str,
        system_prompt: str = None,
        messages: List[Dict] = None,
        max_tokens: int = 512,
        temperature: float = 0.7,
        stream: bool = False
    ) -> Dict[str, Any]:
        """Make API call to Ollama"""
        url = f"{self.base_url}/api/chat"
        
        # Build messages array
        if messages:
            ollama_messages = messages
        else:
            ollama_messages = [{"role": "user", "content": prompt}]
            if system_prompt:
                ollama_messages.insert(0, {"role": "system", "content": system_prompt})
        
        payload = {
            "model": model,
            "messages": ollama_messages,
            "stream": stream,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            }
        }
        
        try:
            response = requests.post(url, json=payload, timeout=120)
            response.raise_for_status()
            data = response.json()
            
            if stream:
                # Handle streaming response
                return {"response": "", "stream": True}
            
            return {
                "response": data.get("message", {}).get("content", ""),
                "success": True,
                "model": data.get("model", model),
                "done": data.get("done", True)
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama API error: {e}")
            return {
                "response": "Sorry, I'm having trouble connecting right now. Please try again.",
                "success": False,
                "error": str(e)
            }
    
    def generate_response(
        self,
        query: str,
        conversation_history: List[Dict] = None,
        system_prompt: str = None,
        max_tokens: int = 512,
        temperature: float = 0.7,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """Generate AI response with conversation history and context management"""
        
        conversation_history = conversation_history or []
        
        # Build messages array
        messages = self._build_messages(conversation_history, query, system_prompt)
        
        # Check context size and summarize if needed
        needs_summarization, total_tokens = self._check_context_size(messages)
        
        if needs_summarization:
            logger.info(f"Context size ({total_tokens} tokens) exceeds threshold, summarizing...")
            # Summarize conversation history (excluding system prompt and current query)
            history_to_summarize = [msg for msg in messages[:-1] if msg.get('role') != 'system']
            if history_to_summarize:
                summary = self._summarize_conversation(history_to_summarize)
                # Replace history with summary
                system_messages = [msg for msg in messages if msg.get('role') == 'system']
                current_query_msg = messages[-1]
                messages = system_messages + [
                    {"role": "system", "content": f"Previous conversation summary: {summary}"},
                    current_query_msg
                ]
                logger.info(f"Summarized context from {len(history_to_summarize)} messages to summary")
        
        # Call Ollama API
        result = self._call_ollama(
            model=self.model_name,
            prompt=query,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return result
    
    def generate_title(self, conversation_messages: List[Dict], max_length: int = 50) -> str:
        """Generate a title for a conversation based on initial messages"""
        if not conversation_messages:
            return "New Conversation"
        
        # Get first few user messages
        user_messages = [
            msg.get('content', '')
            for msg in conversation_messages[:3]
            if msg.get('role') == 'user'
        ]
        
        if not user_messages:
            return "New Conversation"
        
        # Create prompt for title generation
        conversation_text = "\n".join(user_messages[:2])
        title_prompt = f"""Based on this conversation, generate a short, descriptive title (max {max_length} characters):

{conversation_text}

Title:"""
        
        try:
            response = self._call_ollama(
                model=self.model_name,
                prompt=title_prompt,
                system_prompt="You are a helpful assistant that creates concise, descriptive titles for conversations. Return only the title, no additional text.",
                max_tokens=20,
                temperature=0.5
            )
            
            title = response.get('response', '').strip()
            # Clean up title (remove quotes, extra whitespace)
            title = title.strip('"\'')
            title = title.split('\n')[0]  # Take first line only
            title = title[:max_length]  # Enforce max length
            
            if not title or len(title) < 3:
                # Fallback: use first user message
                first_message = user_messages[0][:max_length]
                return first_message if first_message else "New Conversation"
            
            return title
        except Exception as e:
            logger.error(f"Error generating title: {e}")
            # Fallback: use first user message
            if user_messages:
                return user_messages[0][:max_length]
            return "New Conversation"
    
    def health_check(self) -> Dict[str, Any]:
        """Check if Ollama service is healthy"""
        try:
            url = f"{self.base_url}/api/tags"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            return {
                "status": "healthy",
                "models": response.json().get("models", [])
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            }

