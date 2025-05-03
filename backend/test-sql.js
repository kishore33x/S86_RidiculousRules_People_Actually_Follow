const { connectMySQL } = require('./database/db');

(async () => {
  const connection = await connectMySQL();
  const [rows] = await connection.query('SHOW TABLES');
  console.log('📋 Tables in DB:', rows);
  connection.end();
})();
