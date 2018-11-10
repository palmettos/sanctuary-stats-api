const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');


exports.err = function(req, res) {
    res.send('Use /snapshots/<streamer> or /snapshots/<streamer>/<character>');
};

exports.listCharacters = function(req, res) {
    res.send(`${req.params.streamer}'s characters will be listed here`);
}

exports.getsnapshots = function(req, res) {
    res.send(`${req.params.character}'s (${req.params.streamer}) snapshots will be returned here`);
}
