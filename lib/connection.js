const pg = require('pg');
require('dotenv').config();
const { Pool}  = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
module.exports = pool.connect();