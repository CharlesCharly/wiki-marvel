require("dotenv").config();
const express = require("express");
const path = require("path");
const config = require(path.resolve(__dirname, "config.js"));
const {
  getCharacterInfoData,
  getCharacterComicsData,
  formatCharacterInfo,
  formatCharacterComics,
} = require(path.resolve(__dirname, "src", "index.js"));

const app = express();
// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, "src")));
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

      // Fetch comics on first page load in order to not have delay when displaying the page
      // Based on comicsURI, fetch the comics list
      const charComics = await getCharacterComicsData(charData.collectionURI);

      let comicsList = [];
      // Format comics list only if response is not null
      if (typeof charComics != "undefined") {
        comicsList = formatCharacterComics(charComics);
      }

      // Display the full view
      response.render("result", {
        characterName: characterName,
        notFound: false,
        charID: charData.id,
        name: charData.name,
        description: charData.description,
        limitComics: 10,
        totalComics: charData.available,
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

// Endpoint for fetching paginated comics data
app.get("/api/comics", async (request, response) => {
  try {
    const apiURI = "https://gateway.marvel.com";
    const charEndpoint = "/v1/public/characters";

    const { id, offset, limit } = request.query;

    // Based on comicsURI, fetch the paginated comics list
    const charComics = await getCharacterComicsData(
      `${apiURI}${charEndpoint}/${id}/comics`,
      Number(offset),
      Number(limit)
    );

    let comicsList = [];
    // Format comics list only if response is not null
    if (typeof charComics != "undefined") {
      comicsList = formatCharacterComics(charComics);
    }

    // Send the paginated comics data as JSON response
    response.json({
      comics: comicsList,
    });
  } catch (error) {
    response.status(500).json({
      error: "An error occurred, please retry",
    });
  }
});
