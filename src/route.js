const m = require('mithril');
const logger = require('./logger/logger');
const scheduler = require('./scheduler/scheduler');

logger.info("starting application");

m.route(document.body, '/', {
  '/': scheduler,
})
