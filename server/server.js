const express = require("express");
const path = require("path");
const morgan = require("morgan");
const winston = require("winston");

const PORT = process.env.PORT || 3001;

const app = express();

// Postgress connection (add a .env file in the server folder with this text in it "DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_db_name" and replace it with your credentials)
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test pg connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    logger.error("Postgres connection error:", err);
  } else {
    logger.info("Postgres connected: " + JSON.stringify(res.rows[0]));
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
