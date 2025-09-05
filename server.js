const express = require("express");
const { getUsers, addUser, updateUser, deleteUser } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// GET all users
app.get("/db", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

// POST new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).send("Name and Email are required");
  try {
    const newUser = await addUser(name, email);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message.includes("Violation of UNIQUE KEY")) res.status(400).send("Email already exists");
    else res.status(500).send("Failed to add user");
  }
});

// PUT update user
app.put("/users/:id", async (req, res) => {
  const { name, email } = req.body;
  const id = parseInt(req.params.id);
  if (!name || !email) return res.status(400).send("Name and Email are required");
  try {
    const updatedUser = await updateUser(id, name, email);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Failed to update user");
  }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await deleteUser(id);
    res.json({ message: "User deleted", Id: id });
  } catch (err) {
    res.status(500).send("Failed to delete user");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
