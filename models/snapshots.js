const mongoose = require('mongoose');


let characterSchema = {
    channel: {type: String, required: true},
    characterName: {type: String, required: true},
    characterClass: {type: String, required: true},
    characterLevel: {type: Number, required: true},
};

let itemSchema = new mongoose.Schema({
    uniqueName: {type: String, required: true},
    baseName: {type: String, required: true},
    quality: {type: String, required: true},
    location: {type: String, required: true},
    properties: [{type: String, required: false}]
});

let goldSchema = new mongoose.Schema({
    currentGold: {type: Number, required: true},
    delta: {type: Number, required: true, default: 0}
});

let attributeSchema = new mongoose.Schema({
    strength: {type: Number, required: true},
    dexterity: {type: Number, required: true},
    vitality: {type: Number, required: true},
    energy: {type: Number, required: true},

    fireResist: {type: Number, required: true},
    coldResist: {type: Number, required: true},
    lightningResist: {type: Number, required: true},
    poisonResist: {type: Number, required: true},

    fasterHitRecovery: {type: Number, required: true},
    fasterRunWalk: {type: Number, required: true},
    fasterCastRate: {type: Number, required: true},
    increasedAttackSpeed: {type: Number, required: true}
})

let equippedItemsSchema = new mongoose.Schema({
    ...characterSchema,
    payload: [itemSchema]
});

let skillLevelsSchema = new mongoose.Schema({
    ...characterSchema,
    payload: {type: Object, required: true}
});

let goldStateSchema = new mongoose.Schema({
    ...characterSchema,
    payload: goldSchema
});

let attributeStateSchema = new mongoose.Schema({
    ...characterSchema,
    payload: attributeSchema
});

exports.equippedItemsSchema = mongoose.model('equippedItems', equippedItemsSchema);
exports.skillLevelsSchema = mongoose.model('skillLevels', skillLevelsSchema);
exports.goldStateSchema = mongoose.model('goldState', goldStateSchema);
exports.attributeStateSchema = mongoose.model('attributestate', attributeStateSchema);
