const express = require("express");
const { getUsers } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Azure Node.js + SQL App is running!");
});

app.get("/db", async (req, res) => {
  try {
    const data = await getUsers();
    res.json(data);
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
