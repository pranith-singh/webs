const sql = require("mssql");

const config = {
  user: process.env.AZURE_SQL_USERNAME,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  port: parseInt(process.env.AZURE_SQL_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Get users (include new fields)
async function getUsers() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT TOP 10 Id, Name, Email, Phone, City, Role 
       FROM Users ORDER BY Id DESC`
    );
    return result.recordset;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

// Add user with new fields
async function addUser(name, email, phone, city, role) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Name", sql.NVarChar, name)
      .input("Email", sql.NVarChar, email)
      .input("Phone", sql.NVarChar, phone || null)
      .input("City", sql.NVarChar, city || null)
      .input("Role", sql.NVarChar, role || null)
      .query(`
        INSERT INTO Users (Name, Email, Phone, City, Role)
        VALUES (@Name, @Email, @Phone, @City, @Role);
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    return {
      Id: result.recordset[0].Id,
      Name: name,
      Email: email,
      Phone: phone,
      City: city,
      Role: role
    };
  } catch (err) {
    console.error("Insert error:", err);
    throw err;
  }
}

module.exports = { getUsers, addUser };
