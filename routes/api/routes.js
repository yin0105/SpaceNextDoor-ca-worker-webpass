const express = require('express');
const router = express.Router();
const route = {
    openDoor: require('./open-door'),
    statusDoor: require('./status-door'),
    status: require('./status')
}

router.post('/open-door', (req, res, next) => {
    route.openDoor(req, res, next)
})
router.post('/status-door', (req, res, next) => {
    route.statusDoor(req, res, next)
})
router.post('/status', (req, res, next) => {
    route.status(req, res, next)
})

module.exports = router;