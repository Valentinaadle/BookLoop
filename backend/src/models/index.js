const User = require('./User');
const Book = require('./Book');
const Profile = require('./Profile');

// Establecer relaciones
User.hasOne(Profile);
Profile.belongsTo(User);

// Exportar modelos
module.exports = {
  User,
  Book,
  Profile
}; 