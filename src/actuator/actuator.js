const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');
const eventEmitter = require('../event-emitter/event-emitter');

let serialPorts;
let serialPort;
let connected = false;
const commandDelimiter = '\r'

function reconnect() {
  if (!connected) {
    serialPort.open();
    setTimeout(reconnect, 5000);
  }
}

function onDisconnect() {
  eventEmitter.emit('disconnected');
  connected = false;
  reconnect();
}

function onFoundActuator(i) {
  eventEmitter.emit(`connected`, serialPorts[i].comName);
  connected = true;
  serialPorts[i].isActuator = true;
  serialPort = serialPorts[i].serialPort;
  serialPort.on('close', onDisconnect);
}

function writeToSerialPort(message, i) {
  if (connected) {
    serialPort.write(`${message}${commandDelimiter}`);
  } else {
    serialPorts[i].serialPort.write(`${message}${commandDelimiter}`);
  }
}

function sendProbeCommand(i) {
  writeToSerialPort('CP', i);
}

function probePort(i) {
  serialPorts[i].serialPort = new SerialPort(serialPorts[i].comName, { baudRate: 9600, autoOpen: false });
  serialPorts[i].serialPort.on('open', () => { sendProbeCommand(i); });

  serialPorts[i].parser = serialPorts[i].serialPort.pipe(new Delimiter({ delimiter: commandDelimiter }));
  serialPorts[i].parser.on('data', () => { onFoundActuator(i); });

  setTimeout(() => {
    if (!serialPorts[i].isActuator) {
      serialPorts[i].serialPort.close();
    }
  }, 2000);

  serialPorts[i].serialPort.open();
}

function connect() {
  if (!connected) {
    SerialPort.list(function(err, ports) {
      serialPorts = ports.map((port) => { return { comName: port.comName }; });
      serialPorts.forEach((port, i) => {
        probePort(i);
      });
    });
    setTimeout(connect, 5000);
  }
}

function moveToPositionA() {
  writeToSerialPort('GOA');
}

function moveToPositionB() {
  writeToSerialPort('GOB');
}

module.exports = {
  connect,
  moveToPositionA,
  moveToPositionB
};