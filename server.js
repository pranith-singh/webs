const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // your database module

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Add new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, phone, city, role } = req.body;
    if (!name || !email) return res.status(400).send("Name and Email are required");

    const newUser = { Name: name, Email: email, Phone: phone, City: city, Role: role };
    await db.addUser(newUser); // your db.js should handle inserting this
    res.status(200).send({ message: "User added" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save user" });
  }
});

// Get all users
app.get("/db", async (req, res) => {
  try {
    const users = await db.getUsers(); // should return array of objects with Id, Name, Email, Phone, City, Role
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
