const sql = require("mssql");

const config = {
  user: process.env.AZURE_SQL_USERNAME,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  port: parseInt(process.env.AZURE_SQL_PORT) || 1433,
  options: { encrypt: true, trustServerCertificate: false }
};

async function getUsers() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query("SELECT Id, Name, Email FROM Users ORDER BY Id DESC");
    return result.recordset;
  } catch (err) {
    console.error("DB error:", err);
    throw err;
  }
}

async function addUser(name, email) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("Name", sql.NVarChar, name)
      .input("Email", sql.NVarChar, email)
      .query("INSERT INTO Users (Name, Email) VALUES (@Name, @Email); SELECT SCOPE_IDENTITY() AS Id;");
    return { Id: result.recordset[0].Id, Name: name, Email: email };
  } catch (err) {
    console.error("Insert error:", err);
    throw err;
  }
}

async function updateUser(id, name, email) {
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("Id", sql.Int, id)
      .input("Name", sql.NVarChar, name)
      .input("Email", sql.NVarChar, email)
      .query("UPDATE Users SET Name=@Name, Email=@Email WHERE Id=@Id");
    return { Id: id, Name: name, Email: email };
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
}

async function deleteUser(id) {
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("Id", sql.Int, id)
      .query("DELETE FROM Users WHERE Id=@Id");
    return { Id: id };
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}

module.exports = { getUsers, addUser, updateUser, deleteUser };

}

module.exports = { getUsers, addUser };

