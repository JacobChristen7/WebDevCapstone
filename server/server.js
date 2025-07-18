const express = require("express");
const path = require("path");
const morgan = require("morgan");
const winston = require("winston");

const PORT = process.env.PORT || 3001;

const app = express();

// Postgress connection
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test pg connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    logger.error("Postgres connection error:", err);
  } else {
    logger.info("Postgres connected: " + JSON.stringify(res.rows[0]));
  }
});

// Postgres Database API functions

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    logger.info(`Fetched all users: count=${result.rows.length}`);
    res.json(result.rows);
  } catch (err) {
    logger.error("Error fetching users: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Get a user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      logger.info(`User not found: id=${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`Fetched user: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);
  } catch (err) {
    logger.error("Error fetching user: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new user
app.post("/api/users", express.json(), async (req, res) => {
  const { username, email, firstname, lastname, telephone, address, admin } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, firstname, lastname, telephone, address, admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [username, email, firstname, lastname, telephone, address, admin]
    );
    logger.info(`User created: ${JSON.stringify(result.rows[0])}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Error creating user: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a user's info
app.put("/api/users/:id", express.json(), async (req, res) => {
  const { username, email, firstname, lastname, telephone, address, admin } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, firstname = $3, lastname = $4, telephone = $5, address = $6, admin = $7 WHERE id = $8 RETURNING *",
      [username, email, firstname, lastname, telephone, address, admin, req.params.id]
    );
    if (result.rows.length === 0) {
      logger.info(`User not found for update: id=${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`User updated: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);
  } catch (err) {
    logger.error("Error updating user: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      logger.info(`User not found for delete: id=${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`User deleted: ${JSON.stringify(result.rows[0])}`);
    res.json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    logger.error("Error deleting user: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Create winston logger 
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error'}),
    new winston.transports.File({ filename: 'combined.log'}),
    //optional line which adds winston logs to the console
    new winston.transports.Console()
  ]
})

// Have Node serve the files for our built React app (prod)
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Pipe morgan logs into winston combined.log
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}))

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  logger.info("GET /api hit");
  res.json({ message: "Backend server is running" });
});

app.post("/log", (req, res) => {
  logger.info("React page loaded");
  res.sendStatus(200);
});

app.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`);
});
