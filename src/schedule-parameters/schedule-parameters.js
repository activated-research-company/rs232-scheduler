const m = require('mithril');
const state = require('../state/state');

function scheduleParameters() {
  return {
    view: () => m('div',
    [
      m('div', [
        m('div.flex',
          [
            m('div.w-25', 'wait initial'),
            m('input.w-75', { oninput: (event) => { state.waitI = parseFloat(event.target.value); }}),
          ],
        ),
        m('div.flex',
          [
            m('div.w-25', 'wait a'),
            m('input.w-75', { oninput: (event) => { state.waitA = parseFloat(event.target.value); }}),
          ],
        ),
        m('div.flex',
          [
            m('div.w-25', 'wait b'),
            m('input.w-75', { oninput: (event) => { state.waitB = parseFloat(event.target.value); }}),
          ],
        ),
        m('div.flex',
          [
            m('div.w-25', 'wait next temp'),
            m('input.w-75', { oninput: (event) => { state.waitT = parseFloat(event.target.value); }}),
          ],
        ),
        m('div.flex',
          [
            m('div.w-25', 'temperatures'),
            m('input.w-75', { oninput: (event) => { state.temperatures = event.target.value; }}),
          ],
        ),
      ]),
    ]),
  };
}

module.exports = scheduleParameters;
