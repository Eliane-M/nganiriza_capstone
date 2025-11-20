from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework import status
import json

User = get_user_model()


class AuthenticationIntegrationTests(TestCase):
    """Integration tests for authentication endpoints"""

    def setUp(self):
        """Set up test client and test data"""
        self.client = Client()
        self.signup_url = '/api/auth/signup/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.me_url = '/api/auth/me/'
        
        self.valid_user_data = {
            'email': 'testuser@example.com',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'user'
        }

    def test_user_signup_success(self):
        """Test successful user registration"""
        response = self.client.post(
            self.signup_url,
            data=json.dumps(self.valid_user_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.json())
        self.assertEqual(response.json()['user']['email'], self.valid_user_data['email'])
        
        # Verify user was created in database
        self.assertTrue(User.objects.filter(email=self.valid_user_data['email']).exists())

    def test_user_signup_duplicate_email(self):
        """Test signup with existing email fails"""
        # Create first user
        User.objects.create_user(
            email=self.valid_user_data['email'],
            password=self.valid_user_data['password']
        )
        
        # Try to create duplicate
        response = self.client.post(
            self.signup_url,
            data=json.dumps(self.valid_user_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_signup_invalid_email(self):
        """Test signup with invalid email format"""
        invalid_data = self.valid_user_data.copy()
        invalid_data['email'] = 'notanemail'
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_signup_weak_password(self):
        """Test signup with weak password"""
        weak_data = self.valid_user_data.copy()
        weak_data['password'] = '123'
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(weak_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test successful login"""
        # Create user first
        User.objects.create_user(
            email=self.valid_user_data['email'],
            password=self.valid_user_data['password']
        )
        
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': self.valid_user_data['email'],
                'password': self.valid_user_data['password']
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())

    def test_user_login_wrong_password(self):
        """Test login with incorrect password"""
        User.objects.create_user(
            email=self.valid_user_data['email'],
            password=self.valid_user_data['password']
        )
        
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': self.valid_user_data['email'],
                'password': 'WrongPassword123!'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_login_nonexistent_user(self):
        """Test login with non-existent email"""
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'nonexistent@example.com',
                'password': 'SomePassword123!'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_current_user_authenticated(self):
        """Test getting current user info when authenticated"""
        # Create and login user
        user = User.objects.create_user(
            email=self.valid_user_data['email'],
            password=self.valid_user_data['password'],
            first_name=self.valid_user_data['first_name'],
            last_name=self.valid_user_data['last_name']
        )
        
        self.client.force_login(user)
        
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['email'], self.valid_user_data['email'])

    def test_get_current_user_unauthenticated(self):
        """Test getting current user without authentication fails"""
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_success(self):
        """Test successful logout"""
        user = User.objects.create_user(
            email=self.valid_user_data['email'],
            password=self.valid_user_data['password']
        )
        
        self.client.force_login(user)
        
        response = self.client.post(self.logout_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AuthenticationValidationTests(TestCase):
    """Validation tests for authentication data"""

    def setUp(self):
        self.client = Client()
        self.signup_url = '/api/auth/signup/'

    def test_email_validation_empty(self):
        """Test empty email is rejected"""
        data = {
            'email': '',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_validation_missing_at_sign(self):
        """Test email without @ is rejected"""
        data = {
            'email': 'testexample.com',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_validation_missing_domain(self):
        """Test email without domain is rejected"""
        data = {
            'email': 'test@',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_validation_too_short(self):
        """Test password shorter than 6 characters is rejected"""
        data = {
            'email': 'test@example.com',
            'password': '12345',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_validation_empty(self):
        """Test empty password is rejected"""
        data = {
            'email': 'test@example.com',
            'password': '',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_name_validation_empty_first_name(self):
        """Test empty first name is rejected"""
        data = {
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'first_name': '',
            'last_name': 'User'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_name_validation_empty_last_name(self):
        """Test empty last name is rejected"""
        data = {
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': ''
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_whitespace_trimming_email(self):
        """Test email whitespace is handled properly"""
        data = {
            'email': '  test@example.com  ',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'user'
        }
        
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Should either accept and trim or reject
        self.assertIn(
            response.status_code,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        )
