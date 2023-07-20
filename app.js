require('dotenv').config()
const express = require('express');
const path = require('path');
const config = require(path.resolve(__dirname, 'config.js'));
const { getData } = require(path.resolve(__dirname, 'src', 'index.js'));

const app = express();
// Set EJS as view engine
app.set('view engine', 'ejs')
// Express app using JSON payloads for requests
app.use(express.json())
// Parse form data
app.use(express.urlencoded({ extended: true }));

// Set up the server to listen on specific port
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`)
})

// Search page to fetch character info
app.get("/search", (request, response) => {
  response.render('search');
});

app.post("/search", async (request, response) => {
  try {
    const { characterName } = request.body;
    const data = await getData(characterName);

    if (typeof data != 'undefined') {
      // Results found
      response.render("result", {
        characterName: characterName,
        notFound: false,
        name: data.name,
        description: data.description,
        uri: data.resourceURI
      });
    } else {
      // No results found
      response.render("result", {
        characterName: characterName,
        notFound: true
      });
    }
  } catch (error) {
    response.status(500).send("An error occured, please retry");
  }
});
