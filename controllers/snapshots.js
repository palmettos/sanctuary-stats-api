const snapshots = require('../models/snapshots');
const logger = require('../logger');
const mongoose = require('mongoose');
const {
    equippedItemsSchema,
    skillLevelsSchema,
    goldStateSchema,
    attributeStateSchema
} = require('../models/snapshots');


function createGenericUpdateConditions(req) {
    return {
        channel: req.body.channel,
        characterName: req.body.characterName,
        characterClass: req.body.characterClass,
        characterLevel: req.body.characterLevel
    };
}

function createGenericReadConditions(req) {
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
            loggedErrorResponse(err);
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

function genericUpdateAndClear(schema, conditions, req, res) {
    if (!conditions) {
        conditions = createGenericUpdateConditions(req);
    }
    schema.findOneAndUpdate(
        conditions,
        req.body,
        {upsert: true, new: true},
        clearCacheOnUpdate(req, res)
    );
}

function loggedErrorResponse(err) {
    logger.error(err);
    res.sendStatus(500);
}

function transformAttributeResponse(docs) {
    let response = {
        level: [],

        strength: [],
        dexterity: [],
        vitality: [],
        energy: [],

        fireResist: [],
        coldResist: [],
        lightningResist: [],
        poisonResist: [],

        fasterHitRecovery: [],
        fasterRunWalk: [],
        fasterCastRate: [],
        increasedAttackSpeed: []
    }

    for (let doc of docs) {
        response.level.push(doc.characterLevel);

        response.strength.push(doc.payload.strength);
        response.dexterity.push(doc.payload.dexterity);
        response.vitality.push(doc.payload.vitality);
        response.energy.push(doc.payload.energy);

        response.fireResist.push(doc.payload.fireResist);
        response.coldResist.push(doc.payload.coldResist);
        response.lightningResist.push(doc.payload.lightningResist);
        response.poisonResist.push(doc.payload.poisonResist);

        response.fasterHitRecovery.push(doc.payload.fasterHitRecovery);
        response.fasterRunWalk.push(doc.payload.fasterRunWalk);
        response.fasterCastRate.push(doc.payload.fasterCastRate);
        response.increasedAttackSpeed.push(doc.payload.increasedAttackSpeed);
    }

    return response;
}

function genericCachedRead(schema, conditions, req, res) {
    if (!conditions) {
        conditions = createGenericReadConditions(req);
    }
    schema.find(conditions, genericGetAndCache(req, res));
}

exports.genericUpdateHandler = function(schema) {
    return function(req, res) {
        genericUpdateAndClear(schema, null, req, res);
    };
}

exports.genericGetHandler = function(schema) {
    return function(req, res) {
        genericCachedRead(schema, null, req, res);
    };
}

exports.goldUpdateHandler = function(req, res, next) {
    logger.info(`goldUpdateHandler request: ${JSON.stringify(req.body)}`);
    goldStateSchema.findOneAndUpdate(
        createGenericUpdateConditions(req),
        {
            $set: {'payload.currentGold': req.body.payload.currentGold},
            $inc: {'payload.delta': req.body.payload.delta}
        },
        {upsert: true, new: true, setDefaultsOnInsert: true},
        clearCacheOnUpdate(req, res)
    );
}

exports.attributeReadHandler = function(req, res, next) {
    logger.info(`attributeReadHandler request: ${JSON.stringify(req.body)}`);
    attributeStateSchema.find(
        createGenericReadConditions(req),
        (err, docs) => {
            if (err) {
                loggedErrorResponse(err);
            } else if (docs.length > 0) {
                let transformed = transformAttributeResponse(docs);
                req.cache.put(req.cacheKey, transformed);
                res.json(transformed);
            } else {
                res.sendStatus(400);
            }
        }
    )
}
