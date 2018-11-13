const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./logger');
const config = require('./config');
const snapshotsRouter = require('./routes/snapshots');
const authRouter = require('./routes/auth');
const passport = require('passport');


mongoose.connect(`mongodb://${config.db_user}:${config.db_pass}@${config.db_addr}`, {useNewUrlParser: true})
    .then(() => {
        logger.info('Connected to the database.');
        startServer();
    })
    .catch((err) => {
        logger.error(`Error starting server: ${err}`);
        process.exit(1);
    });

function startServer() {
    let app = express();
    require('./auth/init');
    app.use(passport.initialize());
    app.use(bodyParser.json());
    app.use('/snapshots', snapshotsRouter);
    app.use('/auth', authRouter);
    app.all('*', function(req, res) {
        res.send(JSON.stringify({error: 404}));
    });

    app.listen(config.port, () => {
        logger.info(`Listening on port ${config.port}.`);
    });
}
