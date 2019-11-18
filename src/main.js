'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function normalize(a) {
    return Math.round(Math.max(0, Math.min(a, 1)) * 255);
}

var M = [
    3.240969941904521,
    -1.537383177570093,
    -0.498610760293,

    -0.96924363628087,
    1.87596750150772,
    0.041555057407175,

    0.055630079696993,
    -0.20397695888897,
    1.056971514242878
];

var q = 126452;
var r = 769860;

var pad = '00000000';

/**
 * Minimal and fast HSLᵤᵥ implementation. Returns `'#rrggbbaa'` string.
 *
 * @param {number} h HSLᵤᵥ hue (0..360).
 * @param {number} s HSLᵤᵥ saturation (0..100).
 * @param {number} l HSLᵤᵥ lightness (0..100).
 * @param {number} [a] Alpha (0..1).
 */
exports.hsl = function(h, s, l, a) {
    var p = l + 16;
    var i = Math.pow(p, 3) / 1560896; // ← `sub1`
    var j;
    var x;
    var y;
    var z;
    var m = i > 0.0088564516 ? i : l / 903.2962962; // ← `sub2`
    var n;
    var o = Infinity; // ← `c`

    h = (h * Math.PI) / 180; // ← `hrad`

    for (i = 0; i < 9; ) {
        x = M[i++];
        y = M[i++];
        z = M[i++];

        for (j = 0; j < 2; j++) {
            n = (632260 * z - q * y) * m + q * j; // ← `bottom`

            // `length` ↓
            n =
                ((838422 * z + r * y + 731718 * x) * l * m - r * j * l) /
                n /
                (Math.sin(h) - (((284517 * x - 94839 * z) * m) / n) * Math.cos(h));

            o = n >= 0 ? Math.min(o, (n / 100) * s) : o; // ← `c`
        }
    }

    i = l * 13;
    m = (Math.cos(h) * o) / i + 0.19783000664283; // ← `varU`
    n = (Math.sin(h) * o) / i + 0.46831999493879; // ← `varV`

    l = l <= 8 ? l / 903.2962962 : Math.pow(p / 116, 3); // ← `y`
    m = -(9 * l * m) / ((m - 4) * n - m * n); // ← `x`
    o = normalize(a == null ? 1 : a); // ← `rgba`

    for (i = 0, j = 24; i < 9; j -= 8) {
        o +=
            (normalize(
                (a = M[i++] * m + M[i++] * l + (M[i++] * (9 * l - 15 * n * l - n * m)) / (3 * n)) <= 0.0031308
                    ? 12.92 * a
                    : 1.055 * Math.pow(a, 0.416666666666666685) - 0.055
            ) <<
                j) >>>
            0;
    }

    o = o.toString(16);

    return '#' + pad.slice(0, 8 - o.length) + o;
};
