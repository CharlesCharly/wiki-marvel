require('dotenv').config()
const express = require("express");
const config = require("./config.js");

// Express app using JSON payloads for requests
const app = express();
app.use(express.json())

// Set up the server to listen on specific port
app.listen(config.port, () => {
  console.log("Server listening on PORT : ", config.port)
})

// Search page to fetch character info
// TO DO
app.get("/search", (request, response) => {
  const status = {
    "Status": "Running"
  };

  response.send(status);
});
