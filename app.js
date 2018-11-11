
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./logger')
const config = require('./config');
const snapshotsRoute = require('./routes/snapshots');


const app = express();

mongoose.connect(`mongodb://${config.db_user}:${config.db_pass}@${config.db_addr}`)
    .then(() => {
        logger.info('Connected to the database.');
        startServer();
    })
    .catch((err) => {
        logger.error(`Error connecting to the database: ${err}`);
        process.exit(1);
    });

function startServer() {
    app.use(bodyParser.json());
    app.use('/snapshots', snapshotsRoute);
    app.all('*', function(req, res) {
        res.send('You requested something at an invalid endpoint.');
    });

    app.listen(config.port, () => {
        logger.info(`Listening on port ${config.port}.`);
    });
}
