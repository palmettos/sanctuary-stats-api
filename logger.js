const winston = require('winston');
const {format} = require('logform');

winston.configure({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'debug.log',
            level: 'debug'
        })
    ],
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

module.exports = winston;
