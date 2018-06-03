const Keypad = require('./index').Keypad;

const keypad = new Keypad(1, 0x20, null,
  [
    ['1', '2', '3', 'a'],
    ['4', '5', '6', 'b'],
    ['7', '8', '9', 'c'],
    ['*', '0', '#', 'd']
  ],
  [7, 6, 5, 4],
  [3, 2, 1, 0]
);

keypad.registerKeyPressHandler(key => console.info(key));
