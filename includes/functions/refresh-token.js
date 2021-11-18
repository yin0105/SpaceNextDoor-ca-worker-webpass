const axios = require("./../connectors/targetApi");
const config = require('./../../config');
const cache = require('./../cache/main');

const refreshToken = () =>{
    cache.api.token = "Basic YWRtaW46YWRtaW4=";
    cache.api.headers[config.token.key] = cache.api.token;
    axios.defaults.headers.common[config.token.key] = cache.api.token;
}

module.exports = refreshToken;