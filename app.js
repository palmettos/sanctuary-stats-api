
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const snapshotRoute = require('./routes/snapshot');
const app = express();
app.use('/snapshot', snapshotRoute);

let port = 1234;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});