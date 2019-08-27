const m = require('mithril');
const scheduler = require('./scheduler/scheduler');

m.route(document.body, '/', {
  '/': scheduler,
})
