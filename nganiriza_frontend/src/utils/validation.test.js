// Validation utility functions tests

describe('Email Validation', () => {
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  test('accepts valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('first+last@test.com')).toBe(true);
    expect(validateEmail('email@subdomain.example.com')).toBe(true);
  });

  test('rejects invalid email addresses', () => {
    expect(validateEmail('plainaddress')).toBe(false);
    expect(validateEmail('@missinglocal.com')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('missing.domain@.com')).toBe(false);
    expect(validateEmail('two@@domain.com')).toBe(false);
    expect(validateEmail('spaces in@email.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('handles edge cases', () => {
    expect(validateEmail('email@domain..com')).toBe(false);
    expect(validateEmail('.email@domain.com')).toBe(false);
    expect(validateEmail('email.@domain.com')).toBe(false);
    expect(validateEmail('email@domain.com.')).toBe(false);
  });
});

describe('Password Validation', () => {
  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  test('accepts valid passwords', () => {
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('Pass@123')).toBe(true);
    expect(validatePassword('verylongpasswordwithmanychars')).toBe(true);
  });

  test('rejects passwords shorter than 6 characters', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('abc')).toBe(false);
    expect(validatePassword('a')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  test('handles null and undefined', () => {
    expect(validatePassword(null)).toBe(false);
    expect(validatePassword(undefined)).toBe(false);
  });
});

describe('Phone Number Validation', () => {
  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  test('accepts valid phone numbers', () => {
    expect(validatePhone('+250788123456')).toBe(true);
    expect(validatePhone('250788123456')).toBe(true);
    expect(validatePhone('+1234567890')).toBe(true);
    expect(validatePhone('1234567890')).toBe(true);
  });

  test('rejects invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
    expect(validatePhone('+250-788-123')).toBe(false);
    expect(validatePhone('12345678901234567890')).toBe(false); // Too long
  });

  test('accepts empty phone (optional)', () => {
    expect(validatePhone('')).toBe(true);
    expect(validatePhone(null)).toBe(true);
    expect(validatePhone(undefined)).toBe(true);
  });

  test('handles phone with spaces', () => {
    expect(validatePhone('+250 788 123 456')).toBe(true);
    expect(validatePhone('250 788 123 456')).toBe(true);
  });
});

describe('Name Validation', () => {
  const validateName = (name) => {
    return name && name.trim().length > 0;
  };

  test('accepts valid names', () => {
    expect(validateName('John')).toBe(true);
    expect(validateName('Mary Jane')).toBe(true);
    expect(validateName('O\'Brien')).toBe(true);
    expect(validateName('Jean-Pierre')).toBe(true);
  });

  test('rejects empty or whitespace names', () => {
    expect(validateName('')).toBe(false);
    expect(validateName('   ')).toBe(false);
    expect(validateName('\t\n')).toBe(false);
  });

  test('handles null and undefined', () => {
    expect(validateName(null)).toBe(false);
    expect(validateName(undefined)).toBe(false);
  });
});

describe('Date Validation', () => {
  const validateDate = (dateString) => {
    if (!dateString) return true; // Optional
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const validateFutureDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const validatePastDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  };

  test('validates date format', () => {
    expect(validateDate('2024-12-25')).toBe(true);
    expect(validateDate('2024-01-01')).toBe(true);
    expect(validateDate('invalid-date')).toBe(false);
    expect(validateDate('2024-13-01')).toBe(false); // Invalid month
  });

  test('validates future dates for appointments', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    expect(validateFutureDate(tomorrowStr)).toBe(true);
    expect(validateFutureDate('2020-01-01')).toBe(false);
  });

  test('validates past dates for birth dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    expect(validatePastDate(yesterdayStr)).toBe(true);
    expect(validatePastDate('2090-01-01')).toBe(false);
  });

  test('handles empty dates when optional', () => {
    expect(validateDate('')).toBe(true);
    expect(validateDate(null)).toBe(true);
    expect(validateDate(undefined)).toBe(true);
  });
});

describe('Form Data Sanitization', () => {
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim();
  };

  const sanitizeEmail = (email) => {
    return email.toLowerCase().trim();
  };

  test('removes leading and trailing whitespace', () => {
    expect(sanitizeInput('  test  ')).toBe('test');
    expect(sanitizeInput('\ttest\n')).toBe('test');
    expect(sanitizeInput('no spaces')).toBe('no spaces');
  });

  test('handles non-string inputs', () => {
    expect(sanitizeInput(123)).toBe(123);
    expect(sanitizeInput(null)).toBe(null);
    expect(sanitizeInput(undefined)).toBe(undefined);
  });

  test('sanitizes email addresses', () => {
    expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
    expect(sanitizeEmail('User@Domain.Com')).toBe('user@domain.com');
  });
});

describe('Appointment Time Validation', () => {
  const validateTime = (timeString) => {
    if (!timeString) return false;
    const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(timeString);
  };

  test('accepts valid time formats', () => {
    expect(validateTime('09:00')).toBe(true);
    expect(validateTime('14:30')).toBe(true);
    expect(validateTime('00:00')).toBe(true);
    expect(validateTime('23:59')).toBe(true);
  });

  test('rejects invalid time formats', () => {
    expect(validateTime('25:00')).toBe(false);
    expect(validateTime('12:60')).toBe(false);
    expect(validateTime('9:00')).toBe(false); // Missing leading zero
    expect(validateTime('invalid')).toBe(false);
    expect(validateTime('')).toBe(false);
  });
});

describe('Message Length Validation', () => {
  const validateMessageLength = (message, minLength = 1, maxLength = 1000) => {
    if (!message) return false;
    const length = message.trim().length;
    return length >= minLength && length <= maxLength;
  };

  test('accepts messages within valid range', () => {
    expect(validateMessageLength('Hello')).toBe(true);
    expect(validateMessageLength('This is a test message')).toBe(true);
    expect(validateMessageLength('A'.repeat(500))).toBe(true);
  });

  test('rejects messages that are too short', () => {
    expect(validateMessageLength('')).toBe(false);
    expect(validateMessageLength('   ')).toBe(false);
  });

  test('rejects messages that are too long', () => {
    expect(validateMessageLength('A'.repeat(1001))).toBe(false);
    expect(validateMessageLength('A'.repeat(5000), 1, 1000)).toBe(false);
  });

  test('respects custom min/max lengths', () => {
    expect(validateMessageLength('Hi', 5, 100)).toBe(false);
    expect(validateMessageLength('Hello World', 5, 100)).toBe(true);
    expect(validateMessageLength('Test', 1, 3)).toBe(false);
  });
});

describe('Search Query Validation', () => {
  const validateSearchQuery = (query) => {
    if (!query) return true; // Empty search is valid
    return query.trim().length >= 2;
  };

  test('accepts valid search queries', () => {
    expect(validateSearchQuery('doctor')).toBe(true);
    expect(validateSearchQuery('ab')).toBe(true);
    expect(validateSearchQuery('gynecology specialist')).toBe(true);
  });

  test('rejects too short queries', () => {
    expect(validateSearchQuery('a')).toBe(false);
  });

  test('accepts empty queries', () => {
    expect(validateSearchQuery('')).toBe(true);
    expect(validateSearchQuery(null)).toBe(true);
    expect(validateSearchQuery(undefined)).toBe(true);
  });

  test('handles whitespace-only queries', () => {
    expect(validateSearchQuery('   ')).toBe(false);
  });
});





