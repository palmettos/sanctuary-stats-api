const winston = require('winston');
const {format} = require('logform')

winston.configure({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        })
    ],
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

module.exports = winston;
