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

const getData = async (characterName) => {
  const url = `${apiURI}${charEndpoint}`;
  const res = await axios.get(url, {
    params: {
      name: characterName,
      ts: apiTs,
      hash: apiHash,
      apikey: apiPublicKey,
    },
  });

  const [data] = res.data.data.results;
  return data;
};

module.exports = { getData };
