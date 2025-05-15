const { sequelize } = require('../config/db');

async function addQuantityColumn() {
    try {
        await sequelize.query(`
            ALTER TABLE Books 
            ADD COLUMN quantity INTEGER DEFAULT 1
        `);
        console.log('Columna quantity agregada exitosamente');
    } catch (error) {
        console.error('Error al agregar la columna quantity:', error);
        throw error;
    }
}

module.exports = addQuantityColumn; 