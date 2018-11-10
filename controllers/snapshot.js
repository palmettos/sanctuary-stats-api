const Snapshot = require('../models/snapshot');
const logger = require('../logger');
const mongoose = require('mongoose');


exports.test = function(req, res) {
    for (let key of Object.keys(req.body)) {
        logger.info(`${key}: ${req.body[key]}`);
    }
    res.send('In test controller');
};