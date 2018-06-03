const PCF8574 = require('pcf8574').PCF8574;
const i2cBus = require('i2c-bus');

function sleep(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

class Keypad {

  constructor(busNum, addr, intPin, keypadMatrix, rowPins, colPins) {
    this.pcf = new PCF8574(i2cBus.openSync(busNum), addr, true);

    if (intPin !== undefined && intPin !== null) {
      this.pcf.enableInterrupt(intPin);
    } else {
      setInterval(this.pcf.doPoll.bind(this.pcf), 250);
    }

    process.on('SIGINT', () => {
      this.pcf.removeAllListeners();
      this.pcf.disableInterrupt();
    });

    this.keypadMatrix = keypadMatrix;
    this.rowPins = rowPins;
    this.colPins = colPins;

    this.lock = false;
    this.handlers = [];

    (async () => {
      for (const pin of this.rowPins) {
        await this.pcf.inputPin(pin, false);
      }
      for (const pin of this.colPins) {
        await this.pcf.outputPin(pin, true, true);
      }

      this.pcf.on('input', data => this.onKeyPress(data));
    })();
  }

  async onKeyPress(data) {
    if (this.lock) return;

    if (data.value === false) {
      this.lock = true;

      const key = await this.getKey(data.pin);
      if (key) {
        this.handlers.forEach(h => h(key));
      }

      await sleep(300);

      this.lock = false;
    }
  }

  async getKey(rowPin) {
    let rowIndex = this.rowPins.indexOf(rowPin);
    if (rowIndex === -1) {
      return null;
    }

    let colIndex = -1;
    for (let i = 0; i < this.colPins.length; i++) {
      const colPin = this.colPins[i];
      await this.pcf.setPin(colPin);

      await this.pcf.doPoll();
      if (this.pcf.getPinValue(rowPin)) {
        colIndex = i;
      }

      await this.pcf.setPin(colPin);
    }
    if (colIndex === -1) {
      return null;
    }

    return this.keypadMatrix[rowIndex][colIndex];
  }

  registerKeyPressHandler(handler) {
    this.handlers.push(handler);
  }
}

module.exports.Keypad = Keypad;

