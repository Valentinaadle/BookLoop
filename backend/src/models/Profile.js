const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING,
        allowNull: true
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = Profile; 