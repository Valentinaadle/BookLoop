const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexión inicial a MySQL sin base de datos específica
const initDB = new Sequelize('mysql', 'root', '123', {
    host: 'localhost',
    dialect: 'mysql'
});

// Base de datos para usuarios y perfiles
const userDB = new Sequelize(
    'bookloop_users_db',
    'root',
    '123',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Base de datos para libros y préstamos
const bookDB = new Sequelize(
    'bookloop_books_db',
    'root',
    '123',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        // Crear las bases de datos si no existen
        await initDB.query('CREATE DATABASE IF NOT EXISTS bookloop_users_db;');
        await initDB.query('CREATE DATABASE IF NOT EXISTS bookloop_books_db;');
        console.log('Bases de datos creadas o verificadas');

        // Conectar a la base de datos de usuarios
        await userDB.authenticate();
        console.log('Conexión a base de datos de usuarios establecida correctamente.');
        await userDB.sync({ alter: true });
        console.log('Modelos de usuarios sincronizados con la base de datos.');

        // Conectar a la base de datos de libros
        await bookDB.authenticate();
        console.log('Conexión a base de datos de libros establecida correctamente.');
        await bookDB.sync({ alter: true });
        console.log('Modelos de libros sincronizados con la base de datos.');

    } catch (error) {
        console.error('Error al conectar con las bases de datos:', error);
        throw error;
    } finally {
        // Cerrar la conexión inicial
        await initDB.close();
    }
};

module.exports = { userDB, bookDB, connectDB }; 