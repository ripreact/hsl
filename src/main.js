'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let { sin, cos, min, max, round, PI } = Math;
let normalize = a => round(max(0, min(a, 1)) * 255);

let M = [
    3.240969941904521,
    -1.537383177570093,
    -0.498610760293,

    -0.96924363628087,
    1.87596750150772,
    0.041555057407175,

    0.055630079696993,
    -0.20397695888897,
    1.056971514242878,
];

let q = 126452;
let r = 769860;

/**
 * Minimal and fast HSLᵤᵥ implementation. Returns `#rrggbbaa` string.
 *
 * @param h HSLᵤᵥ hue (0..360, will be normalized).
 * @param s HSLᵤᵥ saturation.
 * @param l HSLᵤᵥ lightness.
 * @param a Alpha.
 */
exports.hsl = (h, s, l, a = 1) => {
    let p = l + 16;
    let i = p ** 3 / 1560896; // ← `sub1`
    let j;
    let x;
    let y;
    let z;
    let m = i > 0.0088564516 ? i : l / 903.2962962; // ← `sub2`
    let n;
    let o = Infinity; // ← `c`

    h = (h * PI) / 180; // ← `hrad`

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
                (sin(h) - (((284517 * x - 94839 * z) * m) / n) * cos(h));

            o = n >= 0 ? min(o, (n / 100) * s) : o; // ← `c`
        }
    }

    i = l * 13;
    m = (cos(h) * o) / i + 0.19783000664283; // ← `varU`
    n = (sin(h) * o) / i + 0.46831999493879; // ← `varV`

    l = l <= 8 ? l / 903.2962962 : (p / 116) ** 3; // ← `y`
    m = -(9 * l * m) / ((m - 4) * n - m * n); //      ← `x`
    o = normalize(a); //                              ← `rgba`

    for (i = 0, j = 24; i < 9; j -= 8) {
        o +=
            (normalize(
                (a = M[i++] * m + M[i++] * l + (M[i++] * (9 * l - 15 * n * l - n * m)) / (3 * n)) <= 0.0031308
                    ? 12.92 * a
                    : 1.055 * a ** 0.416666666666666685 - 0.055,
            ) <<
                j) >>>
            0;
    }

    return '#' + o.toString(16).padStart(8, 0);
};
