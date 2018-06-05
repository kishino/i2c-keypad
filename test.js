const Keypad = require('./index').Keypad;

const keypad = new Keypad(1, 0x20, 5,
  [
    ['1', '2', '3', '4'],
    ['5', '6', '7', '8'],
    ['9', '0', 'a', 'b'],
    ['c', 'd', 'e', 'f']
  ],
  [0, 1, 2, 3],
  [7, 6, 5, 4]
);

keypad.registerKeyPressHandler(key => console.info(key));
