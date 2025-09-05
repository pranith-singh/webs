const sql = require("mssql");

const config = {
  user: process.env.AZURE_SQL_USERNAME,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  port: parseInt(process.env.AZURE_SQL_PORT) || 1433,
  options: {
    encrypt: true, // required for Azure
    trustServerCertificate: false
  }
};

async function getUsers() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT TOP 5 name FROM sys.databases");
    return result.recordset;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

module.exports = { getUsers };
