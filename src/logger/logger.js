
const eventEmitter = require('../event-emitter/event-emitter');
const log = require('electron-log');

log.transports.console.level = false;
log.catchErrors();

eventEmitter.on('eventStart', log.info);
eventEmitter.on('connected', (port) => { log.info(`connected on ${port}`); });
eventEmitter.on('error', log.error);
eventEmitter.on('disconnected', () => { log.error('disconnected'); });
eventEmitter.on('lostpower', () => { log.error('lost power'); });

module.exports = log;
