const config = require("../../config");
const axios = require("axios");

const api = axios.create({
  baseURL: config.master.url,
  timeout: 1000,
});

module.exports = api;
