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
const getCharacterComicsData = async () => {};

// Format raw data to extract specific keys
const formatCharacterInfo = (rawData) => {
  const { name = 'Unknown', description = 'No description available', comics = {} } = rawData;
  const { collectionURI } = comics;

  return { name, description, collectionURI };
};

const formatCharacterComics = () => {};

module.exports = { getCharacterInfoData, formatCharacterInfo };
