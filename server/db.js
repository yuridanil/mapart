const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'mapart',
    user: 'mapart',
    password: 'mapart',
    port: 5432
});

module.exports = pool;
