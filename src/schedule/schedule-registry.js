const viciActuatorTwoPosition = require('../schedules/vici-actuator-two-position/vici-actuator-two-position');
const viciActuatorTwoPositionController = require('../schedules/vici-actuator-two-position/vici-actuator-two-position-controller');

const scheduleRegistry = [
  {
    title: 'VICI Two Position Actuator',
    schedule: viciActuatorTwoPosition,
    controller: viciActuatorTwoPositionController
  },
];

module.exports = scheduleRegistry;

