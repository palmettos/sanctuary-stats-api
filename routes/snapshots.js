const express = require('express');
const snapshotsController = require('../controllers/snapshots');
const {
    skillLevelsSchema,
    equippedItemsSchema,
    goldStateSchema,
    attributeStateSchema,
    characterIdentifier
} = require('../models/snapshots');
const passport = require('passport');
const cache = require('memory-cache');
const logger = require('winston');
const {ValidationError} = require('mongoose');
const {
    characterIdValidator,
    equippedItemsValidator,
    skillLevelsValidator,
    goldStateValidator,
    attributeStateValidator
} = require('../models/validators');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');


function cachedResponseIfAvailable(req, res, next) {
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

function forwardCacheInstance(req, res, next) {
    let allowed = Object.keys(characterIdentifier);
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

function checkErrors(req, res, next) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

function filterBody(req, res, next) {
    req.body = matchedData(req);
    logger.debug(`Filtered body: ${JSON.stringify(req.body)}`);
    next();
}

function filterIdGetParameters(req, res, next) {
    req.body = {
        'channel': req.query.channel,
        'characterName': req.query.characterName,
        'characterClass': req.query.characterClass
    };
    next();
}

const router = express.Router();

router.get(
    '/items',
    filterIdGetParameters,
    characterIdValidator,
    checkErrors,
    filterBody,
    cachedResponseIfAvailable,
    snapshotsController.itemReadHandler
);

router.post(
    '/items',
    // passport.authenticate('basic'),
    equippedItemsValidator,
    checkErrors,
    filterBody,
    forwardCacheInstance,
    snapshotsController.itemUpdateHandler
);

router.get(
    '/skills',
    filterIdGetParameters,
    characterIdValidator,
    checkErrors,
    filterBody,
    cachedResponseIfAvailable,
    snapshotsController.skillReadHandler
);

router.post(
    '/skills',
    // passport.authenticate('basic'),
    skillLevelsValidator,
    checkErrors,
    filterBody,
    forwardCacheInstance,
    snapshotsController.skillUpdateHandler
);

router.get(
    '/gold',
    filterIdGetParameters,
    characterIdValidator,
    checkErrors,
    filterBody,
    cachedResponseIfAvailable,
    snapshotsController.goldReadHandler
)

router.post(
    '/gold',
    // passport.authenticate('basic'),
    goldStateValidator,
    checkErrors,
    filterBody,
    forwardCacheInstance,
    snapshotsController.goldUpdateHandler
)

router.get(
    '/attributes',
    filterIdGetParameters,
    characterIdValidator,
    checkErrors,
    filterBody,
    cachedResponseIfAvailable,
    snapshotsController.attributeReadHandler
)

router.post(
    '/attributes',
    // passport.authenticate('basic'),
    attributeStateValidator,
    checkErrors,
    filterBody,
    forwardCacheInstance,
    snapshotsController.attributeUpdateHandler
)

module.exports = router;
