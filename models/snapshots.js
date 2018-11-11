const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
    uniqueName: {type: String, required: true},
    baseName: {type: String, required: true},
    quality: {type: String, required: true},
    location: {type: String, required: true},
    properties: [{type: String, required: false}]
});

let equippedItemsSchema = new mongoose.Schema({
    streamer: {type: String, required: true},
    character: {type: String, required: true},
    timestamp: {type: Number, required: true},
    equipment: [itemSchema],
    charms: [itemSchema]
})

exports.equippedItems = mongoose.model('equippedItems', equippedItemsSchema);
