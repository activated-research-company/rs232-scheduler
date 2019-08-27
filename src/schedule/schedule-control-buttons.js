const m = require('mithril');
const eventEmitter = require('../event-emitter/event-emitter');
const scheduleService = require('./schedule-service');
const state = require('../state/state');
const lock = require('../svg/lock');
const pause = require('../svg/pause');
const play = require('../svg/play');

function scheduleControlButtons() {
  let isConnected = false;
  let isScheduleRunning = false;

  function onConnected() {
    isConnected = true;
  }

  function onDisconnected() {
    isConnected = false;
  }

  function onScheduleIsRunning() {
    m.redraw;
    isScheduleRunning = true;
  }

  function onScheduleIsNotRunning() {
    m.redraw;
    isScheduleRunning = false;
  }

  function getButton() {
    if (state.waitI && state.waitA && state.waitB && state.waitT && state.temperatures && isConnected) {
      return isScheduleRunning ? m(pause, { onclick: scheduleService.pause }) : m(play, { onclick: scheduleService.start });
    } else {
      return m(lock);
    }
  }

  return {
    oninit: () => {
      eventEmitter.on(`connected`, onConnected);
      eventEmitter.on(`disconnected`, onDisconnected);
      eventEmitter.on('scheduleStart', onScheduleIsRunning);
      eventEmitter.on('scheduleComplete', onScheduleIsNotRunning);
      eventEmitter.on('schedulePause', onScheduleIsNotRunning);
      eventEmitter.on('scheduleResume', onScheduleIsRunning);
    },
    view: () => m('div.ml6.mt3.mr6.mb1.tc', getButton()),
  };
}

module.exports = scheduleControlButtons;
