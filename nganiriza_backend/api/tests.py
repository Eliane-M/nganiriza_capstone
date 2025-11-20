from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework import status
import json

User = get_user_model()


class AIEndpointIntegrationTests(TestCase):
    """Integration tests for AI chat endpoint"""

    def setUp(self):
        """Set up test client and test user"""
        self.client = Client()
        self.ai_url = '/api/ai/query/'
        
        # Create test user
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='TestPass123!'
        )

    def test_ai_query_authenticated(self):
        """Test AI query with authenticated user"""
        self.client.force_login(self.user)
        
        response = self.client.post(
            self.ai_url,
            data=json.dumps({
                'query': 'What are symptoms of malaria?',
                'language': 'en'
            }),
            content_type='application/json'
        )
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertIn('response', response.json())

    def test_ai_query_unauthenticated(self):
        """Test AI query without authentication"""
        response = self.client.post(
            self.ai_url,
            data=json.dumps({
                'query': 'What are symptoms of malaria?',
                'language': 'en'
            }),
            content_type='application/json'
        )
        
        # Should either allow or require auth
        self.assertIn(
            response.status_code,
            [status.HTTP_200_OK, status.HTTP_201_CREATED, status.HTTP_401_UNAUTHORIZED]
        )

    def test_ai_query_empty_message(self):
        """Test AI query with empty message"""
        self.client.force_login(self.user)
        
        response = self.client.post(
            self.ai_url,
            data=json.dumps({
                'query': '',
                'language': 'en'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_ai_query_kinyarwanda_language(self):
        """Test AI query in Kinyarwanda"""
        self.client.force_login(self.user)
        
        response = self.client.post(
            self.ai_url,
            data=json.dumps({
                'query': 'Ibimenyetso bya malariya ni ibihe?',
                'language': 'rw'
            }),
            content_type='application/json'
        )
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertIn('response', response.json())

    def test_ai_query_long_message(self):
        """Test AI query with very long message"""
        self.client.force_login(self.user)
        
        long_query = 'A' * 1500  # Very long message
        
        response = self.client.post(
            self.ai_url,
            data=json.dumps({
                'query': long_query,
                'language': 'en'
            }),
            content_type='application/json'
        )
        
        # Should either accept or reject based on length limit
        self.assertIn(
            response.status_code,
            [status.HTTP_200_OK, status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        )


class SpecialistsEndpointIntegrationTests(TestCase):
    """Integration tests for specialists endpoints"""

    def setUp(self):
        """Set up test client and test user"""
        self.client = Client()
        self.specialists_url = '/api/specialists/'
        
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='TestPass123!'
        )

    def test_get_specialists_list(self):
        """Test getting list of specialists"""
        response = self.client.get(self.specialists_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.json(), (list, dict))

    def test_search_specialists_by_query(self):
        """Test searching specialists with query parameter"""
        response = self.client.get(
            self.specialists_url,
            {'search': 'doctor'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_specialists_by_specialty(self):
        """Test filtering specialists by specialty"""
        response = self.client.get(
            self.specialists_url,
            {'specialty': 'General Medicine'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_specialists_by_location(self):
        """Test filtering specialists by location"""
        response = self.client.get(
            self.specialists_url,
            {'location': 'Kigali'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ValidationEndpointTests(TestCase):
    """Tests for data validation across endpoints"""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='TestPass123!'
        )

    def test_query_validation_whitespace_only(self):
        """Test query with only whitespace is rejected"""
        self.client.force_login(self.user)
        
        response = self.client.post(
            '/api/ai/query/',
            data=json.dumps({
                'query': '     ',
                'language': 'en'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_query_validation_special_characters(self):
        """Test query with special characters is handled"""
        self.client.force_login(self.user)
        
        response = self.client.post(
            '/api/ai/query/',
            data=json.dumps({
                'query': '<script>alert("test")</script>',
                'language': 'en'
            }),
            content_type='application/json'
        )
        
        # Should sanitize or reject malicious input
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_search_validation_minimum_length(self):
        """Test search query minimum length validation"""
        response = self.client.get(
            '/api/specialists/',
            {'search': 'a'}  # Too short
        )
        
        # Should either accept or reject based on min length
        self.assertIn(
            response.status_code,
            [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST]
        )

    def test_pagination_validation_invalid_page(self):
        """Test pagination with invalid page number"""
        response = self.client.get(
            '/api/specialists/',
            {'page': 'invalid'}
        )
        
        # Should handle invalid pagination gracefully
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_pagination_validation_negative_page(self):
        """Test pagination with negative page number"""
        response = self.client.get(
            '/api/specialists/',
            {'page': -1}
        )
        
        # Should handle negative page gracefully
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class ErrorHandlingTests(TestCase):
    """Tests for error handling across endpoints"""

    def setUp(self):
        self.client = Client()

    def test_404_on_invalid_endpoint(self):
        """Test 404 error on non-existent endpoint"""
        response = self.client.get('/api/nonexistent/')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_405_on_wrong_http_method(self):
        """Test 405 error on wrong HTTP method"""
        response = self.client.delete('/api/auth/login/')
        
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_malformed_json_handling(self):
        """Test handling of malformed JSON"""
        response = self.client.post(
            '/api/auth/login/',
            data='{"email": invalid json}',
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_content_type_header(self):
        """Test handling of missing content-type header"""
        response = self.client.post(
            '/api/auth/login/',
            data='{"email": "test@example.com", "password": "test"}'
        )
        
        # Should handle gracefully
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
