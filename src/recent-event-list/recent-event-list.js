const m = require('mithril');
const eventEmitter = require('../event-emitter/event-emitter');
const getStandardDateFormat = require('../utility/get-standard-date-format');

function recentEventList() {
  let events = [];

  function addEventToList(title, temperature, loop, startedOn) {
    events.reverse();
    events.push({ title, temperature, loop, startedOn });
    events.reverse();
    events = events.slice(0, 20);
    m.redraw();
  }

  function onScheduleStart(startedOn) {
    addEventToList('schedule started', null, null, startedOn);
  }

  function onScheduleComplete(completedOn) {
    addEventToList('schedule complete', null, null, completedOn);
  }

  function onSchedulePause(startedOn) {
    addEventToList('schedule paused', null, null, startedOn);
  }

  function onScheduleResume(completedOn) {
    addEventToList('schedule resumed', null, null, completedOn);
  }

  function getEventWithTimestamp(event) {
    return [
      m('div.w-30', event.title),
      m('div.w-15.tc', event.temperature),
      m('div.w-15.tc', event.loop),
      m('div.w-40.tr', getStandardDateFormat(new Date(event.startedOn))),
    ];
  }

  function getBackgroundColor(event, index) {
    switch (event.title) {
      case 'schedule started':
        return '.bg-green';
      case 'schedule complete':
        return '.bg-red';
      case 'schedule paused':
          return '.bg-yellow';
      case 'schedule resumed':
          return '.bg-orange';
      default:
        return index % 2 === (events.length % 2 === 0 ? 0 : 1) ? '.bg-moon-gray' : '';
    }
  }

  function getEventRow(event, index) {
    return m(`div.flex.o-${100 - (index * 5)}${getBackgroundColor(event, index)}`, getEventWithTimestamp(event))
  }

  function mapEvents() {
    return events.map(getEventRow);
  }

  return {
    oninit: () => {
      eventEmitter.on('scheduleStart', onScheduleStart);
      eventEmitter.on('scheduleComplete', onScheduleComplete);
      eventEmitter.on('schedulePause', onSchedulePause);
      eventEmitter.on('scheduleResume', onScheduleResume);
      eventEmitter.on('eventStart', addEventToList);
    },
    view: () => m('div.pa1',
      [
        m('div.flex', [
          m('div.w-30.tc.outline', 'Event'),
          m('div.w-15.tc.outline', 'Temp'),
          m('div.w-15.tc.outline', 'Loop #'),
          m('div.w-40.tc.outline', 'Started On'),
        ]),
        m('div', mapEvents()),
      ],
    ),
  };
}

module.exports = recentEventList;
