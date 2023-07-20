require("dotenv").config();
const nock = require("nock");
const {
  getCharacterInfoData,
  getCharacterComicsData,
} = require("../src/index");

// API endpoint
const apiURI = "https://gateway.marvel.com";
const charEndpoint = "/v1/public/characters";
const legitCharComicsID = `${charEndpoint}1011334/comics`;
const fakeCharComicsID = `${charEndpoint}123/comics`;
const nonNumCharComicsID = `${charEndpoint}test/comics`;

describe("Fetch Character Info", () => {
  it("Should returns Marvel character info", async () => {
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

  it("Should returns empty for non-Marvel character", async () => {
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

describe("Fetch Character Comics", () => {
  it("Should returns Marvel character comics list for correct ID", async () => {
    nock(`${apiURI}`)
      .get(`${legitCharComicsID}`)
      .query({
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(200, {
        data: {
          results: [
            {
              title: "Avengers: The Initiative (2007) #19",
              description: "Join the heroes around America in the battle.",
            },
          ],
        },
      });

    const rawData = await getCharacterComicsData(apiURI + legitCharComicsID);

    expect(rawData.title).toEqual("Avengers: The Initiative (2007) #19");
    expect(rawData.description).toEqual(
      "Join the heroes around America in the battle."
    );
  });

  it("Should returns empty for wrong character ID", async () => {
    nock(`${apiURI}`)
      .get(`${fakeCharComicsID}`)
      .query({
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(200, {
        data: {
          results: [],
        },
      });

    const rawData = await getCharacterComicsData(apiURI + legitCharComicsID);

    expect(rawData).toBeUndefined();
  });

  it("Should returns error for non numeric ID value", async () => {
    nock(`${apiURI}`)
      .get(`${nonNumCharComicsID}`)
      .query({
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(409, {
        status:
          "You must pass at least one valid character if you set the character filter.",
      });

    try {
      const rawData = await getCharacterInfoData(characterName);
    } catch (error) {
      expect(error.status).toBe("You must pass at least one valid character if you set the character filter.");
    }

  });
});
