const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app (prod)
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Backend server is running" });
});

app.post("/log", (req, res) => {
  console.log("React page loaded");
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
