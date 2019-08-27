const actuator = require('../actuator/actuator');
const eventEmitter = require('../event-emitter/event-emitter');
const schedule = require('../schedules/vici-actuator-two-position');
const state = require('../state/state');

const eventComplete = 'eventComplete';
let remainingTemperatures = [];
let temperature;
let remainingEvents = [];
let loop;
let paused = false;

function emitEventComplete() {
  if (!paused) { eventEmitter.emit(eventComplete); }
}

function wait(seconds) {
  timeout = setTimeout(emitEventComplete, seconds * 1000);
}

function processEvent(event) {
  eventEmitter.emit('eventStart', event.title, temperature, loop, new Date().toJSON());

  switch (event.command) {
    case 'serial':
      if (event.args === 'A') {
        actuator.moveToPositionA();
      } else {
        actuator.moveToPositionB();
      }
      emitEventComplete();
      break;
    case 'wait':
      wait(event.args);
      break;
    default:
      break;
  }
}

function processNextEvent() {
  if (remainingEvents.length > 0) {
    processEvent(remainingEvents.shift());
  } else if (loop < schedule.loops) {
    loop = loop + 1;
    remainingEvents = JSON.parse(JSON.stringify(schedule.getLoop()));
    processNextEvent();
  } else if (remainingTemperatures.length > 0) {
    loop = 1;
    remainingEvents = JSON.parse(JSON.stringify(schedule.getLoop()));
    temperature = remainingTemperatures.shift();
    processNextEvent();
  } else {
    eventEmitter.emit('scheduleComplete', new Date().toJSON());
  }
}

function start() {
  if (!paused) {
    loop = 0;
    remainingTemperatures = state.temperatures.split(',');
    temperature = remainingTemperatures.shift();
    remainingEvents = JSON.parse(JSON.stringify(schedule.getSetup()));
    eventEmitter.emit('scheduleStart', new Date().toJSON());
    processNextEvent();
  } else {
    paused = false;
    eventEmitter.emit('scheduleResume', new Date().toJSON());
    processNextEvent();
  }
}

function pause() {
  paused = true;
  clearTimeout(timeout);
  eventEmitter.emit('schedulePause', new Date().toJSON());
}

eventEmitter.on(eventComplete, processNextEvent)

actuator.connect();

module.exports = {
  start,
  pause
};
