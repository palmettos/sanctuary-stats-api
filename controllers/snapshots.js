const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');
const {
    equippedItemsSchema,
    skillLevelsSchema
} = require('../models/snapshots');


function genericPostAndClear(schema, conditions, req, res) {
    if (!conditions) {
        conditions = {
            channel: req.body.channel,
            characterName: req.body.characterName,
            characterClass: req.body.characterClass,
            characterLevel: req.body.characterLevel
        };
    }
    schema.findOneAndUpdate(
        conditions,
        {upsert: true, new: true},
        req.body,
        (err, doc) => {
        if (err) {
            logger.error(err);
            req.sendStatus(400);
        } else {
            logger.debug(`cacheKey: ${req.cacheKey}`);
            if (req.cache.del(req.cacheKey)) {
                logger.debug(`Deleting cache entries for ${req.cacheKey}`);
            }
            res.sendStatus(200);
        }
    });
}

function genericCachedGetRequest(schema, conditions, req, res) {
    if (!conditions) {
        conditions = {
            channel: req.body.channel,
            characterName: req.body.characterName,
            characterClass: req.body.characterClass
        };
    }
    schema.find(conditions, (err, docs) => {
        if (err) {
            logger.error(err);
            res.sendStatus(500);
        } else if (docs.length >0) {
            logger.debug(`Request ${JSON.stringify(req.body, null, 2)} returned docs ${docs}`);
            logger.debug(`Caching docs for key: ${req.cacheKey}`);
            req.cache.put(req.cacheKey, docs);
            res.json(docs);
        } else {
            res.sendStatus(404);
        }
    });
}

exports.genericUpdateHandler = function(schema) {
    return function(req, res) {
        genericPostAndClear(schema, null, req, res);
    };
}

exports.genericGetHandler = function(schema) {
    return function(req, res) {
        genericCachedGetRequest(schema, null, req, res);
    };
}
