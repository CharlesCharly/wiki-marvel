require("dotenv").config();
const nock = require('nock');
const {
  formatCharacterInfo,
  formatCharacterComics,
  keepSpecificKeys,
} = require("../src/index");

describe("Format Character Info", () => {
  afterEach(() => {
    // Clean up Nock's request history after each test
    nock.cleanAll();
  });

  it("Should format raw data correctly", () => {
    const rawData = {
      id: 1011334,
      name: "Hulk",
      description: "The angrier the Hulk gets, the stronger the Hulk gets.",
      comics: {
        collectionURI:
          "http://gateway.marvel.com/v1/public/characters/1009351/comics",
      },
    };

    const expectedOutput = {
      id: 1011334,
      name: "Hulk",
      description: "The angrier the Hulk gets, the stronger the Hulk gets.",
      collectionURI:
        "http://gateway.marvel.com/v1/public/characters/1009351/comics",
    };

    const formattedData = formatCharacterInfo(rawData);

    expect(formattedData).toEqual(expectedOutput);
  });

  it("Should handle incorrect raw data", () => {
    // For example, missing 'name' and 'description' properties
    const rawData = {
      comics: {
        collectionURI:
          "http://gateway.marvel.com/v1/public/characters/1009351/comics",
      },
    };

    const expectedOutput = {
      id: 0,
      name: "Unknown",
      description: "No description available",
      collectionURI:
        "http://gateway.marvel.com/v1/public/characters/1009351/comics",
    };

    const formattedData = formatCharacterInfo(rawData);

    expect(formattedData).toEqual(expectedOutput);
  });

  it("Should handle incorrect 'comics' property format in raw data", () => {
    const rawData = {
      id: 1011334,
      name: "Hulk",
      description: "The angrier the Hulk gets, the stronger the Hulk gets.",
      comics: "invalid format, should be an object",
    };

    const expectedOutput = {
      id: 1011334,
      name: "Hulk",
      description: "The angrier the Hulk gets, the stronger the Hulk gets.",
      collectionURI: undefined,
    };

    const result = formatCharacterInfo(rawData);

    expect(result).toEqual(expectedOutput);
  });

  it("Should handle empty raw data", () => {
    const rawData = {};

    const expectedOutput = {
      id: 0,
      name: "Unknown",
      description: "No description available",
      collectionURI: undefined, // Since 'comics' property is missing
    };

    const result = formatCharacterInfo(rawData);

    expect(result).toEqual(expectedOutput);
  });
});

describe("Format Character Comics", () => {
  afterEach(() => {
    // Clean up Nock's request history after each test
    nock.cleanAll();
  });

  it("Should format raw comics list to extract specific keys", () => {
    const rawArray = [
      { title: "Comic 1", description: "Description 1", otherKey: "value" },
      { title: "Comic 2", description: "Description 2", otherKey: "value" },
    ];

    const result = formatCharacterComics(rawArray);

    const expectedResult = [
      { title: "Comic 1", description: "Description 1" },
      { title: "Comic 2", description: "Description 2" },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("Should return an empty array when the input array is empty", () => {
    const rawArray = [];

    const result = formatCharacterComics(rawArray);

    expect(result).toEqual([]);
  });

  it("Should return an empty array when the input array is undefined", () => {
    const result = formatCharacterComics(undefined);

    expect(result).toEqual([]);
  });

  it("Should handle missing keys in the input objects", () => {
    const rawArray = [
      { title: "Comic 1", otherKey: "value" },
      { description: "Description 2", otherKey: "value" },
      { otherKey: "value" },
    ];

    const result = formatCharacterComics(rawArray);

    const expectedResult = [
      { title: "Comic 1", description: undefined },
      { title: undefined, description: "Description 2" },
      { title: undefined, description: undefined },
    ];

    expect(result).toEqual(expectedResult);
  });
});

describe("Keep Specific Keys", () => {
  afterEach(() => {
    // Clean up Nock's request history after each test
    nock.cleanAll();
  });

  it("Should keep specific keys from an array of objects", () => {
    const dataArray = [
      { id: 1, title: "Comic 1", description: "Description 1" },
      { id: 2, title: "Comic 2", description: "Description 2" },
      { id: 3, title: "Comic 3", description: "Description 3" },
    ];

    const keysToKeep = ["title", "description"];

    const result = keepSpecificKeys(dataArray, keysToKeep);

    const expectedResult = [
      { title: "Comic 1", description: "Description 1" },
      { title: "Comic 2", description: "Description 2" },
      { title: "Comic 3", description: "Description 3" },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("Should return an empty array when the input array is empty", () => {
    const dataArray = [];
    const keysToKeep = ["title", "description"];

    const result = keepSpecificKeys(dataArray, keysToKeep);

    expect(result).toEqual([]);
  });

  it("Should return an empty array when the input array is undefined", () => {
    const result = keepSpecificKeys(undefined, ["id", "name"]);

    expect(result).toEqual([]);
  });

  it("Should keep only existing keys from the input objects", () => {
    const dataArray = [
      { id: 1, title: "Comic 1", description: "Description 1" },
      { title: "Comic 2", description: "Description 2" },
      { title: "Comic 3" },
    ];

    const keysToKeep = ["title", "description"];

    const result = keepSpecificKeys(dataArray, keysToKeep);

    const expectedResult = [
      { title: "Comic 1", description: "Description 1" },
      { title: "Comic 2", description: "Description 2" },
      { title: "Comic 3" },
    ];

    expect(result).toEqual(expectedResult);
  });
});
