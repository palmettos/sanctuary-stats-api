const mongoose = require('mongoose');


let characterIdentifier = {
    channel: {type: String},
    characterName: {type: String},
    characterClass: {type: String}
};

let characterIdSchema = new mongoose.Schema({
    ...characterIdentifier
});

let itemSchema = new mongoose.Schema({
    uniqueName: {type: String},
    baseName: {type: String},
    quality: {type: String},
    location: {type: String},
    properties: [{type: String}]
});

let goldSchema = new mongoose.Schema({
    currentGold: {type: Number},
    delta: {type: Number, default: 0}
});

let attributeSchema = new mongoose.Schema({
    strength: {type: Number},
    dexterity: {type: Number},
    vitality: {type: Number},
    energy: {type: Number},

    fireResist: {type: Number},
    coldResist: {type: Number},
    lightningResist: {type: Number},
    poisonResist: {type: Number},

    fasterHitRecovery: {type: Number},
    fasterRunWalk: {type: Number},
    fasterCastRate: {type: Number},
    increasedAttackSpeed: {type: Number}
});

let equippedItemsSchema = new mongoose.Schema({
    ...characterIdentifier,
    characterLevel: {type: Number},
    payload: [itemSchema]
});

let skillLevelsSchema = new mongoose.Schema({
    ...characterIdentifier,
    characterLevel: {type: Number},
    payload: {type: Object}
});

let goldStateSchema = new mongoose.Schema({
    ...characterIdentifier,
    characterLevel: {type: Number},
    payload: goldSchema
});

let attributeStateSchema = new mongoose.Schema({
    ...characterIdentifier,
    characterLevel: {type: Number},
    payload: attributeSchema
});

exports.equippedItemsSchema = mongoose.model('equippedItems', equippedItemsSchema);
exports.skillLevelsSchema = mongoose.model('skillLevels', skillLevelsSchema);
exports.goldStateSchema = mongoose.model('goldState', goldStateSchema);
exports.attributeStateSchema = mongoose.model('attributestate', attributeStateSchema);
exports.characterIdSchema = mongoose.model('characterId', characterIdSchema);
exports.characterIdentifier = characterIdentifier;
