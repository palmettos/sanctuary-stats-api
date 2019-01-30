const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./logger');
const config = require('./config');
const snapshotsRouter = require('./routes/snapshots');
const authRouter = require('./routes/auth');
const passport = require('passport');


mongoose.connect(
    `mongodb://${config.db_user}:${config.db_pass}@${config.db_addr}`,
    {useNewUrlParser: true}
)
    .then(() => {
        logger.info('Connected to the database.');
        startServer();
    })
    .catch((err) => {
        logger.error(`Error starting server: ${err}`);
        process.exit(1);
    });

function startServer() {
    // Initialize the router
    let app = express();
    let v1 = express.Router();
    
    // Set CORS header
    v1.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });

    // Initialize endpoints
    v1.use('/snapshots', snapshotsRouter);
    v1.use('/auth', authRouter);
    
    // Initialize authentication modules
    app.use(passport.initialize());
    require('./auth/init');

    // Initialize body parser
    app.use(bodyParser.json());

    // Append everything to the v1 URL
    app.use('/api/v1', v1);

    // Respond with 404 to any request that falls through
    app.all('*', function(req, res) {
        res.sendStatus(404);
    });

    // Listen
    app.listen(config.port, () => {
        logger.info(`Listening on port ${config.port}.`);
    });
}
