const { sequelize } = require('../config/db');

async function updateImageUrlLength() {
    try {
        await sequelize.query(`
            ALTER TABLE Books 
            MODIFY COLUMN imageUrl VARCHAR(1000)
        `);
        console.log('Columna imageUrl modificada exitosamente');
    } catch (error) {
        console.error('Error al modificar la columna imageUrl:', error);
        throw error;
    }
}

module.exports = updateImageUrlLength; 