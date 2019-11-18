const { performance } = require('perf_hooks');
const { hsluvToHex } = require('hsluv');
const { hsl } = require('..');

const { min, max, round, random } = Math;

const normalize = n => round(max(0, min(n, 1)) * 255);

const old = (h, s, l, a = 1) => {
    let j;
    let bottom;
    let length;

    const M = [
        [3.240969941904521, -1.537383177570093, -0.498610760293],
        [-0.96924363628087, 1.87596750150772, 0.041555057407175],
        [0.055630079696993, -0.20397695888897, 1.056971514242878],
    ];

    const fromLinear = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** 0.416666666666666685 - 0.055);

    const { sin, cos, min } = Math;

    const hrad = (h * Math.PI) / 180;
    const bounds = [];
    const sub1 = (l + 16) ** 3 / 1560896;
    const sub2 = sub1 > 0.0088564516 ? sub1 : l / 903.2962962;

    const _ = M.forEach(([a, b, c]) => {
        for (j = 0; j < 2; j++) {
            bottom = (632260 * c - 126452 * b) * sub2 + 126452 * j;

            bounds.push([
                ((284517 * a - 94839 * c) * sub2) / bottom,
                ((838422 * c + 769860 * b + 731718 * a) * l * sub2 - 769860 * j * l) / bottom,
            ]);
        }
    });

    const c = bounds.reduce((result, [a, b]) => {
        length = b / (sin(hrad) - a * cos(hrad));

        return length >= 0 ? min(result, (length / 100) * s) : result;
    }, Infinity);

    const varU = (cos(hrad) * c) / (13 * l) + 0.19783000664283;
    const varV = (sin(hrad) * c) / (13 * l) + 0.46831999493879;

    const y = l <= 8 ? l / 903.2962962 : ((l + 16) / 116) ** 3;
    const x = -(9 * y * varU) / ((varU - 4) * varV - varU * varV);

    return `rgba(${M.map(([a, b, c]) => {
        return Math.round(
            Math.max(0, min(fromLinear(a * x + b * y + (c * (9 * y - 15 * varV * y - varV * x)) / (3 * varV)), 1)) *
                255,
        );
    })},${a})`;
};

// prettier-ignore
const FunA = (h, s, l, a) => (hsluvToHex([h, s, l]) + normalize(a).toString(16).padStart(2, 0));
const FunB = (h, s, l, a) => hsl(h, s, l, a);
const FunC = (h, s, l, a) => old(h, s, l, a);

let sum = [];

for (let i = 0; i < 10000; i++) {
    sum.push(FunB(random(), random(), random(), random()));
    sum.push(FunA(random(), random(), random(), random()));
    sum.push(FunC(random(), random(), random(), random()));
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

a = performance.now();
for (let i = 0; i < r; i++) sum.push(FunC(random(), random(), random(), random()));
console.log('FunC : %s rps, side effect = %s.', (r / (performance.now() - a)) * 1000, sum.length);
sum = [];