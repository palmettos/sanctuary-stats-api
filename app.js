
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./logger')
const config = require('./config');

const snapshotsRoute = require('./routes/snapshots');

const app = express();

mongoose.connect(`mongodb://${config.db_user}:${config.db_pass}@${config.db_addr}`, function(error) {
    error ? logger.error(error) : logger.info('Connected to database.');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/snapshots', snapshotsRoute);

app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}.`);
});
