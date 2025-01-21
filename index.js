const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Arya@123",  // Replace with your MySQL root password
  database: "chatbot_db",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1); // Exit the application if connection fails
  }
  console.log("Connected to MySQL with mysql2");
});

// API endpoint to send a message (save it to the database)
app.post("/send-message", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send({ error: "Message cannot be empty" });
  }

  const query = "INSERT INTO messages (text) VALUES (?)";
  db.query(query, [message], (err, result) => {
    if (err) {
      console.error("Error saving message:", err);
      return res.status(500).send({ error: "Failed to save message" });
    }

    res.send({ id: result.insertId, message });
  });
});

// API endpoint to retrieve all messages
app.get("/get-messages", (req, res) => {
  const query = "SELECT * FROM messages";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving messages:", err);
      return res.status(500).send({ error: "Failed to retrieve messages" });
    }

    res.send(results);
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
