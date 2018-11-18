const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');
const {equippedItemsSchema} = require('../models/snapshots');


exports.getEquippedItems = function(req, res) {
    res.send(`This will retrieve the equipped items of ${req.params.streamer}'s character named ${req.params.character}`);
}

exports.updateEquippedItems = function(req, res) {
    logger.debug('In processEquippedItems handler.');
    logger.info(JSON.stringify(req.body, null, 2));
    equippedItemsSchema.findOneAndUpdate(
        {
            channel: req.body.channel,
            characterName: req.body.characterName,
            characterClass: req.body.characterClass,
            characterLevel: req.body.characterLevel,
        },
        req.body,
        {upsert: true, new: true},
        (err, doc, res) => {
            if (err) {
                logger.error(`Error writing equipped snapshot to db: ${err}`);
            } else {
                logger.info(`Successfully wrote to db: ${doc}`);
            }
        });
    res.send('Snapshots will be sent here by streamers');
}
