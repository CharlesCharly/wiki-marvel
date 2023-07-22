require("dotenv").config();
const express = require("express");
const path = require("path");
const config = require(path.resolve(__dirname, "config.js"));
const {
  getCharacterInfoData,
  getCharacterComicsData,
  formatCharacterInfo,
  formatCharacterComics
} = require(path.resolve(__dirname, "src", "index.js"));

const app = express();
// Set EJS as view engine
app.set("view engine", "ejs");
// Express app using JSON payloads for requests
app.use(express.json());
// Parse form data
app.use(express.urlencoded({ extended: true }));

// Set up the server to listen on specific port
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});

// Search page to fetch character info
app.get("/search", (request, response) => {
  response.render("search");
});

app.post("/search", async (request, response) => {
  try {
    const { characterName } = request.body;
    const rawData = await getCharacterInfoData(characterName);

    if (typeof rawData != "undefined") {
      // Results found, format the character info
      const charData = formatCharacterInfo(rawData);

      // Based on comicsURI, fetch the comics list
      const charComics = await getCharacterComicsData(charData.collectionURI);
      let comicsList = [];

      // Format comics list only if response is not an error code
      if (!(charComics.code === 409 && charComics.status)) {
        comicsList = formatCharacterComics(charComics);
      }

      response.render("result", {
        characterName: characterName,
        notFound: false,
        name: charData.name,
        description: charData.description,
        comics: comicsList,
      });
    } else {
      // No results found
      response.render("result", {
        characterName: characterName,
        notFound: true,
      });
    }
  } catch (error) {
    response.status(500).send("An error occured, please retry");
  }
});
