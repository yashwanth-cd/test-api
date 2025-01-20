const express = require("express");
const cors = require("cors"); // Import cors package
const app = express();
const port = process.env.PORT || 3000;

// Use the CORS middleware for all routes
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world! This is your Render API.");
});

app.get("/api/example", (req, res) => {
  res.json({ message: "This is an example endpoint." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
