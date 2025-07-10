const { expect } = require('chai');

describe('Basic Tests', () => {
  it('should run a simple test', () => {
    expect(2 + 2).to.equal(4);
  });

  it('should test string operations', () => {
    const str = 'BookLoop';
    expect(str).to.have.length(8);
    expect(str.toLowerCase()).to.equal('bookloop');
  });

  it('should test array operations', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).to.have.length(5);
    expect(arr.includes(3)).to.be.true;
  });
});

describe('Environment Variables', () => {
  it('should have test environment variables set', () => {
    expect(process.env.NODE_ENV).to.equal('test');
    expect(process.env.JWT_SECRET).to.exist;
    expect(process.env.SUPABASE_URL).to.exist;
  });
}); 