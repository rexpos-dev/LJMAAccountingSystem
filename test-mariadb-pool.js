const mariadb = require('mariadb');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('URL starts with:', connectionString.split(':')[0]);

const pool = mariadb.createPool(connectionString);
console.log('Pool created successfully');
pool.end();
