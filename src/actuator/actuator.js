const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');
const eventEmitter = require('../event-emitter/event-emitter');

let serialPorts;
let serialPort;
let needsPreflight = true;
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

function onLostPower() {
  eventEmitter.emit('disconnected');
  eventEmitter.emit('lostpower');
  lostPower = true;
}

function onFoundActuator(i) {
  if (!connected) {
    eventEmitter.emit(`connected`, serialPorts[i].comName);
    connected = true;
    serialPort = serialPorts[i].serialPort;
    serialPorts[i].isActuator = true;
    serialPorts[i].parser.on('data', () => { 
      lostPower = false;
      needsPreflight = false;
    });
    serialPort.on('close', onDisconnect);
    serialPort.on('error', (error) => { eventEmitter.emit('error', error); });
  }
}

function writeToSerialPort(message, i) {
  if (connected) {
    if (needsPreflight) {
      serialPort.write(`CP${commandDelimiter}`);
      setTimeout(() => {
        if (!needsPreflight) {
          writeToSerialPort(message);
        } else {
          onLostPower();
        }
      }, 500);
    } else {
      serialPort.write(`${message}${commandDelimiter}`);
      needsPreflight = true;
    }
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