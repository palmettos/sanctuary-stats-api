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

function loggedErrorResponse(res, err) {
    logger.error(err);
    res.sendStatus(400);
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

function transformGoldResponse(docs) {
    let response = {
        level: [],
        currentGold: [],
        currentGoldDelta: []
    }

    for (let doc of docs) {
        response.level.push(doc.characterLevel);
        response.currentGold.push(doc.payload.currentGold);
        response.currentGoldDelta.push(doc.payload.delta);
    }

    return response;
}

function transformSkillResponse(docs) {
    let response = {
        level: [],
        skills: []
    }

    for (let doc of docs) {
        response.level.push(doc.characterLevel);
        let current = {}
        for (let key of Object.keys(doc.payload)) {
            current[key] = doc.payload[key];
        }
        response.skills.push(current);
    }
    
    return response;
}

function transformItemResponse(docs) {
    let response = {
        level: [],
        items: []
    }

    for (let doc of docs) {
        response.level.push(doc.characterLevel);
        let current = []
        for (let item of doc.payload) {
            let obj = {
                properties: item.properties,
                uniqueName: item.uniqueName,
                baseName: item.baseName,
                quality: item.quality,
                location: item.location
            };
            current.push(obj);
        }
        response.items.push(current);
    }

    return response;
}

exports.goldReadHandler = function(req, res, next) {
    logRequest('goldReadHandler', req);
    goldStateSchema.find(
        createGenericReadConditions(req),
        createGenericCachingTransformation(req, res, transformGoldResponse)
    );
}

exports.goldUpdateHandler = function(req, res, next) {
    logRequest('goldUpdateHandler', req);
    goldStateSchema.findOneAndUpdate(
        createGenericUpdateConditions(req),
        {
            $set: {'payload.currentGold': req.body.payload.currentGold},
            $inc: {'payload.delta': req.body.payload.delta}
        },
        {upsert: true, new: true, setDefaultsOnInsert: true},
        createGenericCacheClearingUpdate(req, res)
    );
}

exports.attributeReadHandler = function(req, res, next) {
    logRequest('attributeReadHandler', req);
    attributeStateSchema.find(
        createGenericReadConditions(req),
        createGenericCachingTransformation(req, res, transformAttributeResponse)
    );
}

exports.attributeUpdateHandler = function(req, res, next) {
    logRequest('attributeUpdateHandler', req);
    attributeStateSchema.findOneAndUpdate(
        createGenericUpdateConditions(req),
        req.body,
        {upsert: true, new: true},
        createGenericCacheClearingUpdate(req, res)
    );
}

exports.skillReadHandler = function(req, res, next) {
    logRequest('skillReadHandler', req);
    skillLevelsSchema.find(
        createGenericReadConditions(req),
        createGenericCachingTransformation(req, res, transformSkillResponse)
    );
}

exports.skillUpdateHandler = function(req, res, next) {
    logRequest('skillUpdateHandler', req);
    skillLevelsSchema.findOneAndUpdate(
        createGenericUpdateConditions(req),
        req.body,
        {upsert: true, new: true},
        createGenericCacheClearingUpdate(req, res)
    );
}

exports.itemReadHandler = function(req, res, next) {
    logRequest('itemReadHandler', req);
    equippedItemsSchema.find(
        createGenericReadConditions(req),
        createGenericCachingTransformation(req, res, transformItemResponse)
    );
}

exports.itemUpdateHandler = function(req, res, next) {
    logRequest('itemUpdateHandler', req);
    equippedItemsSchema.findOneAndUpdate(
        createGenericUpdateConditions(req),
        req.body,
        {upsert: true, new: true},
        createGenericCacheClearingUpdate(req, res)
    );
}

function logRequest(funcName, req) {
    logger.debug(`Request received: ${funcName}: ${JSON.stringify(req.body)}`);
}

function logCacheClear(funcName, req) {
    logger.debug(`${funcName}: Cache cleared for request: ${JSON.stringify(req.body)}`);
}

function createGenericCacheClearingUpdate(req, res) {
    return function(err, doc) {
        if (err) {
            loggedErrorResponse(res, err);
        } else {
            if (req.cache.del(req.cacheKey)) {
                logCacheClear('createGenericClearCacheResponse', req);
            }
            // send notification over pubsub asynchronously
            res.sendStatus(200);
        }
    }
}

function createGenericCachingTransformation(req, res, transform) {
    return (err, docs) => {
        if (err) {
            loggedErrorResponse(res, err);
        } else if (docs.length > 0) {
            let transformed = transform(docs);
            logger.debug(`Caching data for request: ${JSON.stringify(req.body)}`);
            req.cache.put(req.cacheKey, transformed);
            res.json(transformed);
        } else {
            res.sendStatus(404);
        }
    }
}
