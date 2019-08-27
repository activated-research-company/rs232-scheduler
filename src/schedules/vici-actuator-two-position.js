const settings = require('electron-settings');
const state = require('../state/state');

const schedule = {
  loops: 3,
  getSetup: () => [
    {
      title: 'move to position A',
      command: 'serial',
      args: 'A',
    },
    {
      title: 'wait for temp',
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
};

module.exports = schedule;
