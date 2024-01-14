import request from 'supertest';
import { app } from '../../server';

// Define the valid and invalid credentials for reusability and scalability
const VALID_CREDENTIALS = {
  name: 'Valid User',
  email: 'validEmail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

const invalidEmailCredentials = {
  ...VALID_CREDENTIALS,
  email: 'invalidEmail',
};

const mismatchedPasswordCredentials = {
  ...VALID_CREDENTIALS,
  confirmPassword: 'MismatchedPassword123!',
};

const passwordTestCases = [
  {
    password: 'short',
    expectedMessage: 'Password must be at least 8 characters.',
  },
  {
    password: 'Password',
    expectedMessage: 'Password must contain at least 1 number.',
  },
  {
    password: '12345678',
    expectedMessage: 'Password must contain at least 1 uppercase letter and 1 lowercase letter.',
  },
  {
    password: 'PASSWORD123',
    expectedMessage: 'Password must contain at least 1 lowercase letter.',
  },
  {
    password: 'password123',
    expectedMessage: 'Password must contain at least 1 uppercase letter.',
  },
];

describe('User Registration Process', () => {
  // Test for email validation
  describe('Email Validation', () => {
    it('should respond with a 422 status code when an invalid email is provided', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(invalidEmailCredentials);
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toBe('Invalid email address.');
    });

    it('should respond with a 200 status code when a valid email is provided', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(200);
    });

    it('should respond with 422 for empty email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({ ...VALID_CREDENTIALS, email: '' });
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toMatch(/Email is required/);
    });
  });

  // Test for password validation
  describe('Password Validation', () => {
    passwordTestCases.forEach(({ password, expectedMessage }) => {
      it(`should respond with a 422 status code and appropriate message when the password "${password}" does not meet the strength requirements`, async () => {
        const response = await request(app)
          .post('/api/v1/auth/signup')
          .send({ ...VALID_CREDENTIALS, password, confirmPassword: password });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe(expectedMessage);
      });
    });

    it('should respond with a 200 status code when the password meets the strength requirements', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(200);
    });

    it('should not allow common passwords', async () => {
      const commonPasswords = ['password', '123456', 'qwerty'];
      for (const password of commonPasswords) {
        const response = await request(app)
          .post('/api/v1/auth/signup')
          .send({ ...VALID_CREDENTIALS, password, confirmPassword: password });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toMatch(/Password is too common/);
      }
    });

    it('should not allow passwords containing user information', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({ ...VALID_CREDENTIALS, password: 'ValidUser123!', confirmPassword: 'ValidUser123!' });
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toMatch(/Password cannot contain user information/);
    });
  });

  // Test for password confirmation
  describe('Password Confirmation', () => {
    it('should respond with a 422 status code when the confirmPassword does not match the password', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(mismatchedPasswordCredentials);
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toBe('Passwords do not match.');
    });

    it('should respond with a 200 status code when the confirmPassword matches the password', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(200);
    });
  });

  // User creation
  describe('User Creation', () => {
    it('should create a new user with valid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.message).toBe('User created successfully');
    });

    it('should not allow duplicate email addresses', async () => {
      await request(app).post('/api/v1/auth/signup').send(VALID_CREDENTIALS);
      const response = await request(app).post('/api/v1/auth/signup').send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toBe('Email already exists');
    });
  });
});
