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
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role_key';

// Mock Supabase globally before any imports
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis()
  }))
}));

// Mock fetch globally
global.fetch = jest.fn();

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
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup logic after each test
}); 