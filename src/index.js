const axios = require("axios");
const md5 = require("md5");
const path = require("path");
const config = require("../config.js");

// Retrieve Marvel developer public and private key
const apiPublicKey = config.apiPublicKey;
const apiPrivateKey = config.apiPrivateKey;

// Generate timestamp for authentication
const apiTs = Date.now();
// Md5 digest of the TS parameter, privatte and public key for authentication
const apiHash = md5(apiTs + apiPrivateKey + apiPublicKey);

// API endpoint
const apiURI = "https://gateway.marvel.com";
const charEndpoint = "/v1/public/characters";

// Get raw character data
const getCharacterInfoData = async (characterName) => {
  const url = `${apiURI}${charEndpoint}`;
  const response = await axios.get(url, {
    params: {
      name: characterName,
      ts: apiTs,
      hash: apiHash,
      apikey: apiPublicKey,
    },
  });

  const [rawData] = response.data.data.results;

  return rawData;
};

// Get raw character comics data
const getCharacterComicsData = async (characterComicsURI, offset = 0, limit = 100) => {
  // API limit is 100 comics at a time
  try {
    let response = await axios.get(characterComicsURI, {
      params: {
        limit,
        offset,
        ts: apiTs,
        hash: apiHash,
        apikey: apiPublicKey,
      },
    });

    const rawData = response.data.data.results;

    return rawData;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 409
    ) {
      // If the response code is 409, return null
      return null;
    } else {
      // If there was an error response from the API
      throw error;
    }
  }
};

// Format raw character info to extract specific keys
const formatCharacterInfo = (rawData) => {
  const {
    name = "Unknown",
    description = "No description available",
    comics = {},
  } = rawData;
  const { collectionURI } = comics;

  return { name, description, collectionURI };
};

// Format raw comics list to extract specific keys
const formatCharacterComics = (rawArray) => {
  const keysToKeep = ["title", "description"];

  const comicsList = keepSpecificKeys(rawArray, keysToKeep);

  return comicsList;
};

// Keep specific keys from an array and return the new array
const keepSpecificKeys = (dataArray, keysToKeep) => {
  if (!dataArray) {
    return [];
  }

  return dataArray.map((dataItem) => {
    const filteredData = {};

    keysToKeep.forEach((key) => {
      if (dataItem.hasOwnProperty(key)) {
        filteredData[key] = dataItem[key];
      }
    });

    return filteredData;
  });
};

module.exports = {
  getCharacterInfoData,
  getCharacterComicsData,
  formatCharacterInfo,
  formatCharacterComics,
  keepSpecificKeys,
};
