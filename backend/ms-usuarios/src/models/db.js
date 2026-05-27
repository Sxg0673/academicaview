const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'academica123',
  database: process.env.DB_NAME || 'academicaview'
});
module.exports = connection;
