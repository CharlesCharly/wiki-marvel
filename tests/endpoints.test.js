require("dotenv").config();
const nock = require("nock");
const { getCharacterInfoData } = require("../src/index");

// API endpoint
const apiURI = "https://gateway.marvel.com";
const charEndpoint = "/v1/public/characters";

describe("Fetch Character Info", () => {
  it("Checks if API returns Marvel character info", async () => {
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
              comics: {
                collectionURI:
                  "http://gateway.marvel.com/v1/public/characters/1009351",
              },
            },
          ],
        },
      });

    const characterName = "hulk";
    const rawData = await getCharacterInfoData(characterName);

    expect(rawData.name).toEqual("Hulk");
    expect(rawData.description).toEqual(
      "The angrier the Hulk gets, the stronger the Hulk gets."
    );
    expect(rawData.comics.collectionURI).toEqual(
      "http://gateway.marvel.com/v1/public/characters/1009351"
    );
  });

  it("Checks if API returns empty for non-Marvel character", async () => {
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
    const rawData = await getCharacterInfoData(characterName);

    expect(rawData).toBeUndefined();
  });
});
