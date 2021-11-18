const config = require('../../config');
const cache = require('./../cache/main');

const populateDoors = (callbackFunction) => {
    cache.doors['door'] = {
        status: 'closed',
        provider: config.providerId,
        doorId: 'door',
        internalId: 'door'
    }
    callbackFunction();
}

module.exports = populateDoors;