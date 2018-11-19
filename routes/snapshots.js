const express = require('express');
const snapshotsController = require('../controllers/snapshots');
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

const router = express.Router();

router.get(
    '/items',
    validator.validate({body: getSnapshotRequestSchema}),
    (req, res, next) => {
        let key = JSON.stringify(Object.assign({url: req.originalUrl.replace(/\/$/, '')}, req.body));
        let data = cache.get(key);
        if (data) {
            res.json(data);
        } else {
            req.cache = cache;
            req.cacheKey = key;
            next();
        }
    },
    snapshotsController.getEquippedItems
);

router.post(
    '/items',
    validator.validate({body: postSnapshotRequestSchema}),
    (req, res, next) => {
        let {characterLevel, payload, ...keyProps} = req.body;
        req.cacheKey = JSON.stringify(Object.assign({url: req.originalUrl.replace(/\/$/, '')}, keyProps));
        req.cache = cache;
        next();
    },
    snapshotsController.updateEquippedItems
);

router.get(
    '/skills',
    validator.validate({body: getSnapshotRequestSchema}),

    snapshotsController.getSkillLevels
);

router.post(
    '/skills',
    validator.validate({body: postSnapshotRequestSchema}),

    snapshotsController.updateSkillLevels
);

module.exports = router;
