const m = require('mithril');
const eventEmitter = require('../event-emitter/event-emitter');

function status() {
  let statusMessage = 'looking for vici actuator';

  eventEmitter.on('connected', (comName) => {
    statusMessage = `connected to vici actuator on ${comName}`;
    m.redraw();
  });

  eventEmitter.on('disconnected', () => {
    statusMessage = 'lost connection to vici actuator';
    m.redraw();
  });

  return {
    view: () => m('div.mt3.tc', statusMessage),
  };
}

module.exports = status;