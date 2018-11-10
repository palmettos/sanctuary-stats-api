const mongoose = require('mongoose');

let snapshotsSchema = new mongoose.Schema({
    broadcaster: {type: String, required: true},
    gold: {type: Number, required: true}
});

module.exports = mongoose.model('Snapshot', snapshotsSchema);
