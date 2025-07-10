// Jest setup file for backend tests
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'test_database';
process.env.JWT_SECRET = 'test_secret_key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test_anon_key';

// Global test setup
global.console = {
  ...console,
  // Uncomment to suppress console during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Setup and teardown for tests
beforeAll(() => {
  // Setup logic before all tests
});

afterAll(() => {
  // Cleanup logic after all tests
});

beforeEach(() => {
  // Setup logic before each test
});

afterEach(() => {
  // Cleanup logic after each test
}); 