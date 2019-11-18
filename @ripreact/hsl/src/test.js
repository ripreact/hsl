const snapshot = require('./test.json');
const { hsl } = require('../dist/index.cjs.js');

for (const { input, expected } of snapshot) {
    const got = hsl(...input);
    if (got !== expected) {
        console.log(got, expected);
        throw new Error('Ti pidor.');
    }
}

console.log('ok');
