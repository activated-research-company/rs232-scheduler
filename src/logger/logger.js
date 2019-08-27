
const eventEmitter = require('../event-emitter/event-emitter');
const log = require('electron-log');

log.transports.console.level = false;
log.catchErrors();

eventEmitter.on('eventStart', log.info);

module.exports = log;
