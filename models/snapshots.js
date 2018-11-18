const mongoose = require('mongoose');


let itemSchema = new mongoose.Schema({
    //uid: {type: Number, required: true},
    uniqueName: {type: String, required: true},
    baseName: {type: String, required: true},
    quality: {type: String, required: true},
    //page: {type: String, required: true},
    location: {type: String, required: true},
    properties: [{type: String, required: false}]
});

let equippedItemsSchema = new mongoose.Schema({
    timestamp: {type: Number, required: true},
    channel: {type: String, required: true},
    characterName: {type: String, required: true},
    characterClass: {type: String, required: true},
    characterLevel: {type: Number, required: true},
    payload: [itemSchema]
});

exports.equippedItemsSchema = mongoose.model('equippedItems', equippedItemsSchema);
