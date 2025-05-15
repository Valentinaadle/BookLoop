const { connectDB } = require('./config/db');
const updateImageUrlLength = require('./migrations/updateImageUrlLength');

async function runMigration() {
    try {
        await connectDB();
        await updateImageUrlLength();
        console.log('Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error durante la migración:', error);
        process.exit(1);
    }
}

runMigration(); 