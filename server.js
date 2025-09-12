app.post("/users", async (req, res) => {
  const { name, email, phone, city, role, avatar } = req.body;
  if (!name || !email) return res.status(400).send("Name and Email are required");

  try {
    // Add user to DB including avatar
    const newUser = await addUser(name, email, phone, city, role, avatar);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add user");
  }
});
const express = require("express");const { getUsers, addUser } = require("./db");
const app = express();const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public")); // 👈 serve frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/db", async (req, res) => {
  try {
    const data = await getUsers();
    res.json(data);
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send("Name and Email are required");
  }
  try {
    const newUser = await addUser(name, email);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send("Failed to add user");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
 
