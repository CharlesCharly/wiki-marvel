require('dotenv').config()
const nock = require('nock');
const md5 = require("md5");
const { getData } = require('../src/index');

// Retrieve Marvel developer public and private key
const apiPublicKey = process.env.MARVEL_API_PUBLIC_KEY
const apiPrivateKey = process.env.MARVEL_API_PRIVATE_KEY

// Generate timestamp for authentication
const apiTs = Date.now()
// Md5 digest of the TS parameter, private and public key for authentication
const apiHash = md5(apiTs+apiPrivateKey+apiPublicKey)

// API endpoint
const apiURI = "https://gateway.marvel.com"
const charEndpoint = "/v1/public/characters"

describe('characterInfo', () => {

  it("checks if API returns Marvel character info", async () => {
    nock(`${apiURI}`)
      .get(`${charEndpoint}`)
      .query({
        name: "hulk",
        ts: apiTs,
        hash: apiHash,
        apikey: apiPublicKey,
      })
      .reply(200, {
        data: {
          results: [
            {
              name: "Hulk",
              description: "The angrier the Hulk gets, the stronger the Hulk gets.",
              resourceURI: "http://gateway.marvel.com/v1/public/characters/1009351"
            }
          ]
        }
      });

    const characterName = "hulk"
    const response = await getData(characterName);

    expect(response.data.results[0].name).toEqual("Hulk");
    expect(response.data.results[0].description).toEqual("The angrier the Hulk gets, the stronger the Hulk gets.");
    expect(response.data.results[0].resourceURI).toEqual("http://gateway.marvel.com/v1/public/characters/1009351");
  });

  it("checks if API returns empty for non-Marvel character", async () => {
    nock(`${apiURI}`)
      .get(`${charEndpoint}`)
      .query({
        name: "superman",
        ts: apiTs,
        hash: apiHash,
        apikey: apiPublicKey,
      })
      .reply(200, {
        data: {
          results: []
        }
      });
    const characterName = "superman"
    const response = await getData(characterName);

    expect(response.data.results).toHaveLength(0);
  });
});
