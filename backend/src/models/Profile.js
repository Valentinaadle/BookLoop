const { DataTypes } = require('sequelize');
const { userDB } = require('../config/db');

const Profile = userDB.define('Profile', {
    foto_perfil: {
        type: DataTypes.STRING,
        allowNull: true
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Profile; 