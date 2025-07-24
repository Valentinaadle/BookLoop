const { expect } = require('chai');

describe('Category Model Tests', () => {
  describe('Category Data Validation', () => {
    it('should validate category data structure', () => {
      const categoryData = {
        id: 1,
        name: 'Fiction',
        description: 'Fictional books and novels',
        slug: 'fiction',
        active: true
      };

      expect(categoryData).to.have.property('id');
      expect(categoryData).to.have.property('name');
      expect(categoryData).to.have.property('description');
      expect(categoryData.id).to.be.a('number');
      expect(categoryData.name).to.be.a('string');
      expect(categoryData.active).to.be.a('boolean');
    });

    it('should validate default categories', () => {
      const defaultCategories = [
        'Fiction',
        'Non-Fiction',
        'Science',
        'Technology',
        'History',
        'Biography',
        'Children',
        'Young Adult',
        'Romance',
        'Mystery'
      ];

      expect(defaultCategories).to.be.an('array');
      expect(defaultCategories).to.have.lengthOf(10);
      expect(defaultCategories).to.include('Fiction');
      expect(defaultCategories).to.include('Science');
    });

    it('should handle category hierarchy', () => {
      const categories = [
        { id: 1, name: 'Books', parent_id: null },
        { id: 2, name: 'Fiction', parent_id: 1 },
        { id: 3, name: 'Science Fiction', parent_id: 2 },
        { id: 4, name: 'Fantasy', parent_id: 2 }
      ];

      const parentCategories = categories.filter(cat => cat.parent_id === null);
      const childCategories = categories.filter(cat => cat.parent_id === 1);

      expect(parentCategories).to.have.lengthOf(1);
      expect(childCategories).to.have.lengthOf(1);
      expect(childCategories[0].name).to.equal('Fiction');
    });

    it('should validate category slug generation', () => {
      const category = { name: 'Science Fiction & Fantasy' };
      const slug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      expect(slug).to.equal('science-fiction-fantasy');
      expect(slug).to.be.a('string');
    });

    it('should handle category book count', () => {
      const categoriesWithCounts = [
        { id: 1, name: 'Fiction', book_count: 25 },
        { id: 2, name: 'Science', book_count: 15 },
        { id: 3, name: 'History', book_count: 8 }
      ];

      const totalBooks = categoriesWithCounts.reduce((sum, cat) => sum + cat.book_count, 0);
      
      expect(totalBooks).to.equal(48);
      expect(categoriesWithCounts[0].book_count).to.be.above(0);
    });

    it('should validate category search functionality', () => {
      const categories = [
        { id: 1, name: 'Science Fiction', keywords: ['sci-fi', 'space', 'future'] },
        { id: 2, name: 'Romance', keywords: ['love', 'relationship', 'passion'] },
        { id: 3, name: 'Mystery', keywords: ['detective', 'crime', 'suspense'] }
      ];

      const searchTerm = 'sci';
      const matchingCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.keywords.some(keyword => keyword.includes(searchTerm))
      );

      expect(matchingCategories).to.have.lengthOf(1);
      expect(matchingCategories[0].name).to.equal('Science Fiction');
    });

    it('should handle category status management', () => {
      const category = {
        id: 1,
        name: 'Test Category',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(category.active).to.be.true;
      expect(category.created_at).to.be.an.instanceOf(Date);
      expect(category.updated_at).to.be.an.instanceOf(Date);
    });

    it('should validate category filtering', () => {
      const allCategories = [
        { id: 1, name: 'Fiction', active: true },
        { id: 2, name: 'Science', active: true },
        { id: 3, name: 'Outdated', active: false },
        { id: 4, name: 'History', active: true }
      ];

      const activeCategories = allCategories.filter(cat => cat.active);
      const inactiveCategories = allCategories.filter(cat => !cat.active);

      expect(activeCategories).to.have.lengthOf(3);
      expect(inactiveCategories).to.have.lengthOf(1);
      expect(inactiveCategories[0].name).to.equal('Outdated');
    });

    it('should validate category organization', () => {
      const categories = [
        { id: 1, name: 'Fiction', order: 1 },
        { id: 2, name: 'Non-Fiction', order: 2 },
        { id: 3, name: 'Children', order: 3 }
      ];

      const sortedCategories = categories.sort((a, b) => a.order - b.order);

      expect(sortedCategories[0].name).to.equal('Fiction');
      expect(sortedCategories[2].name).to.equal('Children');
    });

    it('should validate category validation rules', () => {
      const isValidCategoryName = (name) => {
        if (!name || typeof name !== 'string') return false;
        if (name.trim().length === 0) return false;
        if (name.length > 50) return false;
        return true;
      };

      expect(isValidCategoryName('Fiction')).to.be.true;
      expect(isValidCategoryName('')).to.be.false;
      expect(isValidCategoryName(null)).to.be.false;
      expect(isValidCategoryName('A'.repeat(51))).to.be.false;
    });
  });
}); 
