const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');


exports.getEquippedItems = function(req, res) {
    res.send(`This will retrieve the equipped items of ${req.params.streamer}'s character named ${req.params.character}`);
}

exports.updateEquippedItems = function(req, res) {
    logger.debug('In processEquippedItems handler.');
    res.send('Snapshots will be sent here by streamers');
}
