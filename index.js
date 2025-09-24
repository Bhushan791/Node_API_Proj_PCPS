const express = require("express");
const db = require("./src/configs/db");
const config = require("./src/configs/config");

const app = express();

const port = config.PORT;
app.use(express.json());

// Connect to the database
db.connect();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get("/", (req, res) => {
  res.send("Hello World k xa🌎🎉"); 
});


