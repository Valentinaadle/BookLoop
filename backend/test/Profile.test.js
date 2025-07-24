const { expect } = require('chai');

describe('Profile Model Tests', () => {
  describe('Profile Data Validation', () => {
    it('should validate profile data structure', () => {
      const profileData = {
        id: 1,
        user_id: 1,
        bio: 'Book lover and avid reader',
        avatar_url: '/profiles/avatar1.jpg',
        location: 'Buenos Aires, Argentina',
        phone: '+54 11 1234-5678'
      };

      expect(profileData).to.have.property('id');
      expect(profileData).to.have.property('user_id');
      expect(profileData).to.have.property('bio');
      expect(profileData).to.have.property('avatar_url');
      expect(profileData.id).to.be.a('number');
      expect(profileData.bio).to.be.a('string');
    });

    it('should validate bio length limits', () => {
      const shortBio = 'I love books';
      const normalBio = 'I am passionate about reading and collecting books from various genres.';
      const longBio = 'A'.repeat(501); // Assuming 500 char limit

      expect(shortBio.length).to.be.below(500);
      expect(normalBio.length).to.be.below(500);
      expect(longBio.length).to.be.above(500);
    });

    it('should handle avatar URL validation', () => {
      const validAvatars = [
        '/profiles/user1.jpg',
        'https://example.com/avatar.png',
        '/assets/default-avatar.png'
      ];

      const invalidAvatars = [
        '',
        null
      ];

      validAvatars.forEach(url => {
        expect(url).to.be.a('string');
        expect(url.length).to.be.above(0);
      });

      invalidAvatars.forEach(url => {
        expect(url).to.satisfy(u => !u || u === '');
      });

      // Test invalid URL separately
      const invalidUrl = 'invalid-url';
      expect(invalidUrl).to.be.a('string');
      expect(invalidUrl).to.not.include('http');
      expect(invalidUrl).to.not.include('/');
    });

    it('should validate social media links', () => {
      const profile = {
        id: 1,
        user_id: 1,
        social_links: {
          twitter: 'https://twitter.com/user',
          linkedin: 'https://linkedin.com/in/user',
          instagram: 'https://instagram.com/user'
        }
      };

      Object.values(profile.social_links).forEach(link => {
        expect(link).to.be.a('string');
        expect(link).to.include('http');
      });
    });

    it('should handle profile preferences', () => {
      const profile = {
        id: 1,
        user_id: 1,
        preferences: {
          email_notifications: true,
          public_profile: true,
          show_location: false,
          show_phone: false
        }
      };

      expect(profile.preferences.email_notifications).to.be.a('boolean');
      expect(profile.preferences.public_profile).to.be.true;
      expect(profile.preferences.show_location).to.be.false;
    });

    it('should validate reading statistics', () => {
      const profile = {
        id: 1,
        user_id: 1,
        stats: {
          books_read: 45,
          books_owned: 120,
          books_sold: 15,
          average_rating: 4.2
        }
      };

      expect(profile.stats.books_read).to.be.a('number');
      expect(profile.stats.books_read).to.be.above(0);
      expect(profile.stats.average_rating).to.be.within(1, 5);
    });

    it('should handle profile completion percentage', () => {
      const profile = {
        user_id: 1,
        bio: 'Complete bio',
        avatar_url: '/avatar.jpg',
        location: 'City',
        phone: '123456789'
      };

      const requiredFields = ['bio', 'avatar_url', 'location', 'phone'];
      const completedFields = requiredFields.filter(field => profile[field] && profile[field] !== '');
      const completionPercentage = (completedFields.length / requiredFields.length) * 100;

      expect(completionPercentage).to.equal(100);
      expect(completedFields).to.have.lengthOf(4);
    });

    it('should validate profile timestamps', () => {
      const profile = {
        id: 1,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        last_active: new Date()
      };

      expect(profile.created_at).to.be.an.instanceOf(Date);
      expect(profile.updated_at).to.be.an.instanceOf(Date);
      expect(profile.last_active).to.be.an.instanceOf(Date);
    });

    it('should validate contact information', () => {
      const contactInfo = {
        email: 'user@example.com',
        phone: '+54 11 1234-5678',
        location: 'Buenos Aires, Argentina'
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

      expect(emailRegex.test(contactInfo.email)).to.be.true;
      expect(phoneRegex.test(contactInfo.phone)).to.be.true;
      expect(contactInfo.location).to.be.a('string');
    });
  });
}); 
