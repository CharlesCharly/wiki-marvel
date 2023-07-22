require("dotenv").config();
const nock = require("nock");
const {
  getCharacterInfoData,
  getCharacterComicsData,
} = require("../src/index");

// API endpoint
const apiURI = "https://gateway.marvel.com";
const charEndpoint = "/v1/public/characters";
const legitCharComicsID = `${charEndpoint}/1011334/comics`;
const fakeCharComicsID = `${charEndpoint}/123/comics`;
const nonNumericCharComicsID = `${charEndpoint}/qwerty/comics`;

describe("Fetch Character Info", () => {
  afterEach(() => {
    // Clean up Nock's request history after each test
    nock.cleanAll();
  });

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

    // Check if the values are the same
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

    // Check if array is undefined since it's not Marvel character
    expect(rawData).toBeUndefined();
  });
});

describe("Fetch Character Comics", () => {
  afterEach(() => {
    // Clean up Nock's request history after each test
    nock.cleanAll();
  });

  it("Should fetch all comics for Marvel character", async () => {
    const limit = 45;
    const offset = 32;
    const total = 120;

    const responseMocks = {
      data: {
        limit,
        offset,
        total,
        count: limit,
        // Create new array of `limit` value length, each element being a comic
        results: Array.from({ length: limit }, (_, index) => ({
          title: `Comic ${offset + index + 1}`,
          description: `Description for Comic ${offset + index + 1}`,
        })),
      },
    };

    nock(`${apiURI}`)
      .get(`${legitCharComicsID}`)
      .query({
        limit: /^[0-9]*$/,
        offset: /^[0-9]*$/,
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(200, responseMocks);

    const rawData = await getCharacterComicsData(
      apiURI + legitCharComicsID,
      offset,
      limit
    );

    // Check if rawData is an array
    expect(Array.isArray(rawData)).toBe(true);
    // Check if the length of rawData is equal to the limit value
    expect(rawData.length).toBe(limit);
    // Check if each element of rawData has the necessary keys (title, description)
    rawData.forEach((comic) => {
      expect(comic).toHaveProperty("title");
      expect(comic).toHaveProperty("description");
    });
  });

  it("Should returns empty for wrong character ID", async () => {
    nock(`${apiURI}`)
      .get(`${fakeCharComicsID}`)
      .query({
        limit: /^[0-9]*$/,
        offset: /^[0-9]*$/,
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(200, {
        data: {
          results: [],
        },
      });

    const rawData = await getCharacterComicsData(apiURI + fakeCharComicsID);

    // Check if array result is empty
    expect(rawData).toHaveLength(0);
  });

  it("Should returns error for non numeric ID value", async () => {
    nock(`${apiURI}`)
      .get(`${nonNumericCharComicsID}`)
      .query({
        limit: /^[0-9]*$/,
        offset: /^[0-9]*$/,
        ts: /^[0-9]*$/,
        hash: /^[a-zA-Z0-9_]*$/,
        apikey: /^[a-zA-Z0-9_]*$/,
      })
      .reply(409, {
        code: 409,
        status: "An error occurred while fetching comics data.",
      });

    const rawData = await getCharacterComicsData(apiURI + nonNumericCharComicsID)

    // Check if undefined since we received an error
    expect(rawData).toBeNull();
  });
});
