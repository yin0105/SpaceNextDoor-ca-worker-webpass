const config = require("../../config");
const axios = require("axios");
const https = require("https");

const api = axios.create({
  baseURL: config.target.url,
  timeout: 10000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

module.exports = api;
