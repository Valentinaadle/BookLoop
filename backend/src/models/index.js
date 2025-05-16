const User = require('./User');
const Profile = require('./Profile');

// Establecer relaciones
User.hasOne(Profile, { foreignKey: 'UserId' });
Profile.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
    User,
    Profile
}; 