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

let equippedItemsSchema = new mongoose.Schema({
    ...characterSchema,
    payload: [itemSchema]
});

let skillLevelsSchema = new mongoose.Schema({
    ...characterSchema,
    payload: {type: Object, required: true}
});

exports.equippedItemsSchema = mongoose.model('equippedItems', equippedItemsSchema);
exports.skillLevelsSchema = mongoose.model('skillLevels', skillLevelsSchema);
