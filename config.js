const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.PORT, process.env.WEBHOOK_SECRET, process.env.REPOSITORIES_FULL_PATH,);

module.exports = {
    PORT: process.env.PORT ?? 3000,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    REPOSITORIES_FULL_PATH: process.env.REPOSITORIES_FULL_PATH.split(','),
    VALIDATE_WEBHOOK: process.env.VALIDATE_WEBHOOK === 'TRUE' ? true : false
}