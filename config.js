const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT ?? 3000,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    REPOSITORIES_FULL_PATH: process.env.REPOSITORIES_FULL_PATH.split(','),
}