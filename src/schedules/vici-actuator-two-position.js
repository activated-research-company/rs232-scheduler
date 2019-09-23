const settings = require('electron-settings');
const state = require('../state/state');

const schedule = {
  getSetup: () => [
    {
      title: 'move to position A',
      command: 'serial',
      args: 'A',
    },
    {
      title: 'wait for init temp',
      command: 'wait',
      args: state.waitI,
    },
  ],
  getLoop: () => [
    {
      title: 'move to position A',
      command: 'serial',
      args: 'A',
    },
    {
      title: 'hold position A',
      command: 'wait',
      args: state.waitA,
    },
    {
      title: 'move to position B',
      command: 'serial',
      args: 'B',
    },
    {
      title: 'hold position B',
      command: 'wait',
      args: state.waitB,
    },
  ],
  getBeforeNextLoop: () => [
    {
      title: 'wait for next temp',
      command: 'wait',
      args: state.waitT,
    },
  ],
};

module.exports = schedule;
