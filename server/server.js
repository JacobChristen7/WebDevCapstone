const express = require("express");
const path = require("path");
const morgan = require("morgan");
const winston = require("winston");

const bcrypt = require("bcrypt")

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

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

// JWT strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [jwt_payload.id]);
    const user = result.rows[0];
    if (user) return done(null, user);
    else return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

app.use(passport.initialize());

// User Postgres Database API functions

// User login
app.post('/api/login', express.json(), async (req, res) => {
  const { username, password } = req.body;
  // 1. Find user by username
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // 2. Compare password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  // 3. Sign JWT
  const token = jwt.sign({ id: user.id, admin: user.admin }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Get all users
app.get("/api/users", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
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
app.get("/api/users/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
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
  const { username, email, firstname, lastname, telephone, address, admin, aboutMe, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (username, email, firstname, lastname, telephone, address, admin, "aboutMe", password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [username, email, firstname, lastname, telephone, address, admin, aboutMe, hashedPassword]
    );
    logger.info(`User created: ${JSON.stringify(result.rows[0])}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Error creating user: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a user's info
app.put("/api/users/:id", passport.authenticate('jwt', { session: false }), express.json(), async (req, res) => {
  if (req.user.id !== parseInt(req.params.id) && !req.user.admin) {
  return res.status(403).json({ error: "Forbidden" });
}
  const { username, email, firstname, lastname, telephone, address, admin, aboutMe } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, firstname = $3, lastname = $4, telephone = $5, address = $6, admin = $7, "aboutMe" = $8 WHERE id = $9 RETURNING *',
      [username, email, firstname, lastname, telephone, address, admin, aboutMe, req.params.id]
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
app.delete("/api/users/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.id !== parseInt(req.params.id) && !req.user.admin) {
  return res.status(403).json({ error: "Forbidden" });
}
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

// Courses Postgres Database API functions

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get course by id
app.get("/api/courses/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Create a course
app.post("/api/courses", passport.authenticate('jwt', { session: false }), express.json(), async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const { name, description, credits, capacity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO courses (name, description, credits, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, credits, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update a course
app.put("/api/courses/:id", passport.authenticate('jwt', { session: false }), express.json(), async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  const { name, description, credits, capacity } = req.body;
  try {
    const result = await pool.query(
      "UPDATE courses SET name = $1, description = $2, credits = $3, capacity = $4 WHERE id = $5 RETURNING *",
      [name, description, credits, capacity, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a course
app.delete("/api/courses/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  try {
    const result = await pool.query(
      "DELETE FROM courses WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted", course: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get all courses a user is registered for
app.get("/api/users/:id/registered-courses", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      `SELECT c.* FROM registrations r
       JOIN courses c ON r.course_id = c.id
       WHERE r.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    logger.error("Error fetching registered courses: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Registrations Postgres Database API functions

// Get all registrations
app.get("/api/registrations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registrations");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get registration by ID
app.get("/api/registrations/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registrations WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Create a registration
app.post("/api/registrations", passport.authenticate('jwt', { session: false }), express.json(), async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO registrations (user_id, course_id) VALUES ($1, $2) RETURNING *",
      [user_id, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update a registration
app.put("/api/registrations/:id", passport.authenticate('jwt', { session: false }), express.json(), async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE registrations SET user_id = $1, course_id = $2 WHERE id = $3 RETURNING *",
      [user_id, course_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a registration
app.delete("/api/registrations/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM registrations WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json({ message: "Registration deleted", registration: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Additional API requests

// Get all students registered for a course
app.get("/api/courses/:id/students", async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await pool.query(
      `SELECT u.* FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.course_id = $1`,
      [courseId]
    );
    res.json(result.rows); // array of user objects
  } catch (err) {
    logger.error("Error fetching students for course: " + err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all courses a user is registered for
app.get("/api/users/:id/courses", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      `SELECT c.* FROM registrations r
       JOIN courses c ON r.course_id = c.id
       WHERE r.user_id = $1`,
      [userId]
    );
    res.json(result.rows); // array of course objects
  } catch (err) {
    logger.error("Error fetching courses for user: " + err.message);
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
