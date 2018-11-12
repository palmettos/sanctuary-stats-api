const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');


exports.listCharacters = function(req, res) {
    res.send(`${req.params.streamer}'s characters will be listed here`);
}

exports.getEquippedItems = function(req, res) {
    res.send(`This will retrieve the equipped items of ${req.params.streamer}'s character named ${req.params.character}`);
}

exports.processEquippedItems = function(req, res) {
    logger.info(JSON.stringify(req.body));
    res.send('Snapshots will be sent here by streamers');
}
