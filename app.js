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
    let v1 = express.Router();
    
    v1.use('/snapshots', snapshotsRouter);
    v1.use('/auth', authRouter);
    
    app.use(passport.initialize());
    require('./auth/init');
    app.use(bodyParser.json());
    app.use('/v1', v1);
    app.all('*', function(req, res) {
        res.sendStatus(404);
    });

    app.listen(config.port, () => {
        logger.info(`Listening on port ${config.port}.`);
    });
}
