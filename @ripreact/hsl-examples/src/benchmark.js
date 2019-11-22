const { performance } = require('perf_hooks');
const { hsluvToHex } = require('hsluv');
const { hsl: js } = require('@ripreact/hsl/cjs');
const { hsl: c } = require('@ripreact/hsl/native/cjs');

const { random } = Math;

const FunA = (h, s, l) => hsluvToHex([h, s, l]);
const FunB = js;
const FunC = c;

let acc = [];
let sum = 0;

for (let i = 0; i < 10000; i++) {
    acc.push(FunB(random(), random(), random()));
    acc.push(FunA(random(), random(), random()));
    acc.push(FunC(random(), random(), random()));
}
acc = [];

const r = 3000000;

a = performance.now();
for (let i = 0; i < r; i++) acc.push(FunA(random(), random(), random()));
sum += acc.length;
console.log('Original : %s rps.', (r / (performance.now() - a)) * 1000);
acc = [];

a = performance.now();
for (let i = 0; i < r; i++) acc.push(FunB(random(), random(), random()));
sum += acc.length;
console.log('Latest   : %s rps.', (r / (performance.now() - a)) * 1000);
acc = [];

a = performance.now();
for (let i = 0; i < r; i++) acc.push(FunC(random(), random(), random()));
sum += acc.length;
console.log('C        : %s rps.', (r / (performance.now() - a)) * 1000);
acc = [];

global.sum = sum;
