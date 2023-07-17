require('dotenv').config()
const axios = require('axios');
const md5 = require("md5");

// Retrieve Marvel developer public and private key
const apiPublicKey = process.env.MARVEL_API_PUBLIC_KEY
const apiPrivateKey = process.env.MARVEL_API_PRIVATE_KEY

// Generate timestamp for authentication
const apiTs = Date.now()
// Md5 digest of the TS parameter, privatte and public key for authentication
const apiHash = md5(apiTs+apiPrivateKey+apiPublicKey)

// API endpoint
const apiURI = "https://gateway.marvel.com:443"

test('Fetch one Marvel character info', async () => {
  const endpoint = "/v1/public/characters"
  const url = `${apiURI}${endpoint}`;
  const marvelCharacter = "thor"

  try {
    const response = await axios.get(url, {
      params: {
        name: marvelCharacter,
        ts: apiTs,
        hash: apiHash,
        apikey: apiPublicKey,
      },
    });

    expect(response.status).toBe(200);
  } catch (error) {
    console.log(error);
  }
});
