const sql = require("mssql");

// Configure your DB connection
const config = {
  user: "YOUR_DB_USER",
  password: "YOUR_DB_PASSWORD",
  server: "YOUR_DB_SERVER",
  database: "YOUR_DB_NAME",
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true,
  },
};

// Get all users
async function getUsers() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM Users ORDER BY Id DESC");
    return result.recordset;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Add user with avatar support
async function addUser(name, email, phone, city, role, avatar) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("Name", sql.NVarChar, name)
      .input("Email", sql.NVarChar, email)
      .input("Phone", sql.NVarChar, phone || null)
      .input("City", sql.NVarChar, city || null)
      .input("Role", sql.NVarChar, role || null)
      .input("Avatar", sql.NVarChar, avatar || null)
      .query(`
        INSERT INTO Users (Name, Email, Phone, City, Role, Avatar)
        VALUES (@Name, @Email, @Phone, @City, @Role, @Avatar);
        SELECT * FROM Users WHERE Id = SCOPE_IDENTITY();
      `);
    return result.recordset[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { getUsers, addUser };
