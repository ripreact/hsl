const snapshot = require('./test.json');
const js = require('../dist/index.cjs.js');
const c = require('../native/cjs.js');

for (const { input, expected } of snapshot) {
    const got = js.hsl(...input);
    if (got !== expected) {
        console.log({ input, expected, got });
        throw new Error('Test failed: JS.');
    }
}

for (const { input, expected } of snapshot) {
    const got = c.hsl(...input);
    if (got !== expected) {
        console.log({ input, expected, got });
        throw new Error('Test failed: C.');
    }
}

console.log('ok');

// const { readFileSync } = require('fs');
// const snapshot = require('./test.json');
//
// WebAssembly.instantiate(readFileSync('./dist/index.wasm'), { Math })
//     .then(({ instance }) => {
//         const { hsl: wasm } = instance.exports;
//
//         const hex = (h, s, l) => {
//             // h = h % 360;
//             // h = Math.cos((h < 0 ? h + 360 : h * Math.PI) / 180);
//
//             return (
//                 '#' +
//                 wasm(h, s, l)
//                     .toString(16)
//                     .padStart(6, 0)
//             );
//         };
//
//         for (const { input, expected } of snapshot) {
//             let got;
//
//             try {
//                 got = hex(...input);
//             } catch (e) {
//                 console.log({ input, expected });
//                 throw e;
//             }
//
//             if (got !== expected) {
//                 console.log({ input, expected, got });
//                 throw new Error('Ti pidor.');
//             }
//         }
//
//         console.log('ok');
//     })
//     .catch(console.error);
