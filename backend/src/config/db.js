const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookshop',
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar los modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB
}; 