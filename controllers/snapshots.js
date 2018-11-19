const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');
const {
    equippedItemsSchema,
    skillLevelsSchema
} = require('../models/snapshots');


exports.getEquippedItems = function(req, res, next) {
    equippedItemsSchema.find(
        {
            channel: req.body.channel,
            characterName: req.body.characterName,
            characterClass: req.body.characterClass
        },
        (err, docs) => {
            if (err) {
                logger.error(err);
                res.sendStatus(500);
            } else if (docs.length > 0) {
                logger.debug(`Found document(s): ${docs} // Query: ${JSON.stringify(req.body, null, 2)}`);
                logger.info(`Caching entry for key: ${req.cacheKey}`);
                req.cache.put(req.cacheKey, docs);
                res.json(docs);
            } else {
                res.sendStatus(400);
            }
        }
    );
}

exports.updateEquippedItems = function(req, res) {
    equippedItemsSchema.findOneAndUpdate(
        {
            channel: req.body.channel,
            characterName: req.body.characterName,
            characterClass: req.body.characterClass,
            characterLevel: req.body.characterLevel
        },
        req.body,
        {
            upsert: true,
            new: true
        },
        (err, doc) => {
            if (err) {
                logger.error(err);
                res.sendStatus(400);
            } else {
                logger.info(doc);
                logger.info(`cacheKey: ${req.cacheKey}`);
                if (req.cache.del(req.cacheKey)) {
                    logger.info(`Deleting cache entries for ${req.cacheKey}`);
                }
                res.sendStatus(200);
            }
        }
    )
}

exports.getSkillLevels = function(req, res) {
    res.send(`This will retrieve the skill levels of ${req.params.streamer}'s character named ${req.params.character}`);
}

exports.updateSkillLevels = function(req, res) {
    logger.debug('In updateSkillLevels handler.');
    skillLevelsSchema.findOne(
        {
            channel: req.params.channel,
            characterName: req.params.character,
            characterClass: req.body.characterClass,
            characterLevel: req.body.characterLevel,
            timestamp: {$gte: req.body.timestamp}
        },
        req.body,
        {upsert: true, new: true},
        (err, doc) => {
            if (err) {
                logger.error(`Error writing equipped snapshot to db: ${err}`);
            } else {
                logger.info(`doc: ${doc}`);
            }
        }
    );

    res.sendStatus(200);
}
