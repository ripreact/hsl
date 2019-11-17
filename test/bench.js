const { performance } = require('perf_hooks');
const { hsluvToHex } = require('hsluv');
const { hsl } = require('..');

const { min, max, round, random } = Math;

const normalize = n => round(max(0, min(n, 1)) * 255);

// prettier-ignore
const FunA = (h, s, l, a) => (hsluvToHex([h, s, l]) + normalize(a).toString(16).padStart(2, 0));
const FunB = (h, s, l, a) => hsl(h, s, l, a);

let sum = [];

for (let i = 0; i < 10000; i++) {
    sum.push(FunB(random(), random(), random(), random()));
    sum.push(FunA(random(), random(), random(), random()));
}
sum = [];

const r = 1000000;

a = performance.now();
for (let i = 0; i < r; i++) sum.push(FunA(random(), random(), random(), random()));
console.log('FunA : %s rps, side effect = %s.', (r / (performance.now() - a)) * 1000, sum.length);
sum = [];

a = performance.now();
for (let i = 0; i < r; i++) sum.push(FunB(random(), random(), random(), random()));
console.log('FunB : %s rps, side effect = %s.', (r / (performance.now() - a)) * 1000, sum.length);
sum = [];
