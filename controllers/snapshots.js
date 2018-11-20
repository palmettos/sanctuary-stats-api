const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');
const {
    equippedItemsSchema,
    skillLevelsSchema,
    goldStateSchema
} = require('../models/snapshots');


function createUpdateSchemaConditions(req) {
    return {
        channel: req.body.channel,
        characterName: req.body.characterName,
        characterClass: req.body.characterClass,
        characterLevel: req.body.characterLevel
    };
}

function createReadSchemaConditions(req) {
    return {
        channel: req.body.channel,
        characterName: req.body.characterName,
        characterClass: req.body.characterClass
    };
}

function clearCacheOnUpdate(req, res) {
    return function(err, doc) {
        if (err) {
            logger.error(err);
            res.sendStatus(400);
        } else {
            logger.debug(`cacheKey: ${req.cacheKey}`);
            logger.debug(`req body: ${JSON.stringify(req.body, null, 2)}`);
            logger.debug(`Updated doc: ${doc}`);
            if (req.cache.del(req.cacheKey)) {
                logger.debug(`Deleting cache entries for ${req.cacheKey}`);
            }
            res.sendStatus(200);
        }
    }
}

function genericGetAndCache(req, res) {
    return function(err, docs) {
        if (err) {
            logger.error(err);
            res.sendStatus(500);
        } else if (docs.length > 0) {
            logger.debug(`Request ${JSON.stringify(req.body, null, 2)} returned docs ${docs}`);
            logger.debug(`Caching docs for key: ${req.cacheKey}`);
            req.cache.put(req.cacheKey, docs);
            res.json(docs);
        } else {
            res.sendStatus(404);
        }
    }
}

function genericPostAndClear(schema, conditions, req, res) {
    if (!conditions) {
        conditions = createUpdateSchemaConditions(req);
    }
    schema.findOneAndUpdate(
        conditions,
        req.body,
        {upsert: true, new: true},
        clearCacheOnUpdate(req, res)
    );
}


function genericCachedGetRequest(schema, conditions, req, res) {
    if (!conditions) {
        conditions = createReadSchemaConditions(req);
    }
    schema.find(conditions, genericGetAndCache(req, res));
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

exports.goldUpdateHandler = function(req, res, next) {
    logger.info(`goldUpdateHandler request: ${JSON.stringify(req.body)}`);
    goldStateSchema.findOneAndUpdate(
        createUpdateSchemaConditions(req),
        {
            $set: {'payload.currentGold': req.body.payload.currentGold},
            $inc: {'payload.delta': req.body.payload.delta}
        },
        {upsert: true, new: true, setDefaultsOnInsert: true},
        clearCacheOnUpdate(req, res)
    );
}
