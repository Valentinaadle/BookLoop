// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test_anon_key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role_key';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';

// Mock Supabase globally before any imports
const mockSupabaseClient = {
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
  upsert: jest.fn().mockReturnThis()
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

// Mock fetch globally to prevent real network calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
);

// Mock node-fetch if imported
jest.mock('node-fetch', () => jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(() => Promise.resolve(true))
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: 'test' })),
    verify: jest.fn(() => Promise.resolve(true))
  }))
}));

// Global test setup
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Reset fetch mock to default behavior
  global.fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({})
  });
  
  // Reset Supabase mock methods to default chainable behavior
  Object.keys(mockSupabaseClient).forEach(key => {
    if (typeof mockSupabaseClient[key] === 'function') {
      mockSupabaseClient[key].mockReturnThis();
    }
  });
});

afterEach(() => {
  // Additional cleanup if needed
});

// Export the mock client for use in tests
global.mockSupabaseClient = mockSupabaseClient; 