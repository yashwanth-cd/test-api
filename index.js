const express = require("express");
const cors = require("cors"); // Import cors package
const { Pool } = require("pg"); // Import pg package for PostgreSQL
const app = express();
const { AuthenticationClient } = require("auth0");
const port = process.env.PORT || 3000;

// PostgreSQL connection setup
const pool = new Pool({
  connectionString:
    "postgresql://json_data_user:flBcEiUNca8y0Bndvy2ODtMTeQyDXXI8@dpg-cu71id5umphs73d1n9ag-a.oregon-postgres.render.com/json_data", // Render automatically sets this environment variable for you
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Render's PostgreSQL instance
  },
});

// Use the CORS middleware for all routes
app.use(cors());
app.use(express.json()); // To parse incoming JSON request bodies

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello, world! This is your Render API." });
});

// Example endpoint
app.get("/api/example", (req, res) => {
  res.json({ message: "This is an example endpoint." });
});

app.get("/api/auth", async (req, res) => {
  const domain = process.env.AUTH0_DOMAIN; // Add this to your environment variables
  const clientId = process.env.AUTH0_CLIENT_ID; // Add this to your environment variables

  const authClient = new AuthenticationClient({
    domain: domain,
    clientId: clientId,
  });

  try {
    res.status(200).json(authClient); // Return the token to the frontend
  } catch (error) {
    res.status(500).json({ message: "Auth0 Error", error: error.message });
  }
});

// POST route to insert data into PostgreSQL
app.post("/api/data", async (req, res) => {
  const { name, value } = req.body;

  try {
    // Insert data into the 'data' table
    const result = await pool.query(
      "INSERT INTO data (name, value) VALUES ($1, $2) RETURNING *",
      [name, value]
    );
    res
      .status(201)
      .json({ message: "Data saved successfully", data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving data", error: error.message });
  }
});

// GET route to fetch data from PostgreSQL
app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM data");
    res.status(200).json(result.rows); // Send the rows as JSON response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
