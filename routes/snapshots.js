const express = require('express');
const snapshotsController = require('../controllers/snapshots');
const {
    skillLevelsSchema,
    equippedItemsSchema,
    goldStateSchema,
    attributeStateSchema
} = require('../models/snapshots');
const {Validator, ValidationError} = require('express-json-validator-middleware');
const passport = require('passport');
const cache = require('memory-cache');
const logger = require('winston');


const validator = new Validator({allErrors: true});
postSnapshotRequestSchema = {
    type: 'object',
    required: ['channel', 'characterName', 'characterClass', 'characterLevel'],
    properties: {
        channel: {
            type: 'string'
        },
        characterName: {
            type: 'string'
        },
        characterClass: {
            type: 'string',
            enum: [
                'Amazon',
                'Assassin',
                'Barbarian',
                'Druid',
                'Necromancer',
                'Paladin',
                'Sorceress'
            ]
        },
        characterLevel: {
            type: 'number',
            minimum: 1,
            maximum: 99
        }
    }
}

getSnapshotRequestSchema = {
    type: 'object',
    required: ['channel', 'characterName', 'characterClass'],
    properties: {
        channel: {
            type: 'string'
        },
        characterName: {
            type: 'string'
        },
        characterClass: {
            type: 'string',
            enum: [
                'Amazon',
                'Assassin',
                'Barbarian',
                'Druid',
                'Necromancer',
                'Paladin',
                'Sorceress'
            ]
        }
    }
}

function getGenericCachedResponse(req, res, next) {
    let key = JSON.stringify(Object.assign({url: req.originalUrl.replace(/\/$/, '')}, req.body));
    let data = cache.get(key);
    if (data) {
        logger.debug(`Returning cached data for request: ${JSON.stringify(req.body)}`);
        res.json(data);
    } else {
        req.cache = cache;
        req.cacheKey = key;
        next();
    }
}

function forwardCacheToHandler(req, res, next) {
    let allowed = Object.keys(getSnapshotRequestSchema.properties);
    let filtered = Object.keys(req.body)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {url: req.originalUrl.replace(/\/$/, '')});
    req.cacheKey = JSON.stringify(filtered);
    req.cache = cache;
    next();    
}

const router = express.Router();

router.get(
    '/items',
    validator.validate({body: getSnapshotRequestSchema}),
    getGenericCachedResponse,
    snapshotsController.genericGetHandler(equippedItemsSchema)
);

router.post(
    '/items',
    validator.validate({body: postSnapshotRequestSchema}),
    forwardCacheToHandler,
    snapshotsController.genericUpdateHandler(equippedItemsSchema)
);

router.get(
    '/skills',
    validator.validate({body: getSnapshotRequestSchema}),
    getGenericCachedResponse,
    snapshotsController.genericGetHandler(skillLevelsSchema)
);

router.post(
    '/skills',
    validator.validate({body: postSnapshotRequestSchema}),
    forwardCacheToHandler,
    snapshotsController.genericUpdateHandler(skillLevelsSchema)
);

router.get(
    '/gold',
    validator.validate({body: getSnapshotRequestSchema}),
    getGenericCachedResponse,
    snapshotsController.genericGetHandler(goldStateSchema)
)

router.post(
    '/gold',
    validator.validate({body: postSnapshotRequestSchema}),
    forwardCacheToHandler,
    snapshotsController.goldUpdateHandler
)

router.get(
    '/attributes',
    validator.validate({body: getSnapshotRequestSchema}),
    getGenericCachedResponse,
    snapshotsController.attributeReadHandler
)

router.post(
    '/attributes',
    validator.validate({body: postSnapshotRequestSchema}),
    forwardCacheToHandler,
    snapshotsController.genericUpdateHandler(attributeStateSchema)
)

module.exports = router;
