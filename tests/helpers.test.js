require("dotenv").config();
const { formatCharacterInfo } = require("../src/index");

describe("Format Character Info", () => {
  it("Should format raw data correctly", () => {
    const rawData = {
      name: "Hulk",
      description: "The angrier the Hulk gets, the stronger the Hulk gets.",
      comics: {
        collectionURI:
          "http://gateway.marvel.com/v1/public/characters/1009351/comics",
      },
    };

    const expectedOutput = {
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
      name: "Hulk",
      description: "The angrier the Hulk gets, the stronger the Hulk gets.",
      comics: "invalid format, should be an object",
    };

    const expectedOutput = {
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
      name: "Unknown",
      description: "No description available",
      collectionURI: undefined, // Since 'comics' property is missing
    };

    const result = formatCharacterInfo(rawData);

    expect(result).toEqual(expectedOutput);
  });
});
