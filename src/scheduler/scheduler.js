const status = require('../status/status');
const scheduleParameters = require('../schedule-parameters/schedule-parameters');
const scheduleControlButtons = require('../schedule/schedule-control-buttons');
const recentEventsList = require('../recent-event-list/recent-event-list');

function scheduler() {
   return {
    view: () => m('div.scheduler.pa3', [
      m(scheduleParameters),
      m(status),
      m(scheduleControlButtons),
      m(recentEventsList),
    ]),
  };
}

module.exports = scheduler;
