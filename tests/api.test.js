require("dotenv").config();
const nock = require("nock");
const { getData } = require("../src/index");

// API endpoint
const apiURI = "https://gateway.marvel.com";
const charEndpoint = "/v1/public/characters";

describe("characterInfo", () => {
  it("checks if API returns Marvel character info", async () => {
    nock(`${apiURI}`)
      .get(`${charEndpoint}`)
      .query({
        name: "hulk",
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(200, {
        data: {
          results: [
            {
              name: "Hulk",
              description:
                "The angrier the Hulk gets, the stronger the Hulk gets.",
              resourceURI:
                "http://gateway.marvel.com/v1/public/characters/1009351",
            },
          ],
        },
      });

    const characterName = "hulk";
    const response = await getData(characterName);

    expect(response.name).toEqual("Hulk");
    expect(response.description).toEqual(
      "The angrier the Hulk gets, the stronger the Hulk gets."
    );
    expect(response.resourceURI).toEqual(
      "http://gateway.marvel.com/v1/public/characters/1009351"
    );
  });

  it("checks if API returns empty for non-Marvel character", async () => {
    nock(`${apiURI}`)
      .get(`${charEndpoint}`)
      .query({
        name: "superman",
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(200, {
        data: {
          results: [],
        },
      });
    const characterName = "superman";
    const response = await getData(characterName);

    expect(response).toBeUndefined();
  });
});
