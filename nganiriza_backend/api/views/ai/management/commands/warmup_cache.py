from django.core.management.base import BaseCommand
from api.views.ai.llm_service import LLMService

class Command(BaseCommand):
    help = 'Warm up cache with common queries'
    
    def handle(self, *args, **options):
        llm = LLMService()
        
        common_queries = [
            "Hello, how are you?",
            "What can you help me with?",
            "Tell me about this service",
            # Add more common queries specific to your use case
        ]
        
        self.stdout.write("Warming up cache with common queries...")
        
        for query in common_queries:
            result = llm.generate_response(query, use_cache=True)
            if result['success']:
                self.stdout.write(f"✓ Cached: {query[:50]}...")
            else:
                self.stdout.write(f"✗ Failed: {query[:50]}...")
        
        self.stdout.write(self.style.SUCCESS('Cache warmup complete!'))