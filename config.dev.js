require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  apiPublicKey: process.env.MARVEL_API_PUBLIC_KEY,
  apiPrivateKey: process.env.MARVEL_API_PRIVATE_KEY
};

module.exports = config;
