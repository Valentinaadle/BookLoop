require('dotenv').config({ path: __dirname + '/../.env' });
const result = dotenv.config({ path: __dirname + '/.env' });
console.log('dotenv result:', result);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);