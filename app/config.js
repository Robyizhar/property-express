const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = {
    serviceName: 'ADINO WEB SERVER', 
    rootPath: path.resolve(__dirname, '..'), 
    secretKey: 'asdw1234',
    //----- konfigurasi database ----//
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER, 
    dbPort: process.env.DB_PORT,
    dbPass: process.env.DB_PASS, 
    dbName: process.env.DB_NAME,

};