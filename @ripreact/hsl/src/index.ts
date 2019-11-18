const M = [
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

const q = 126452;
const r = 769860;

const pad = '00000';

const normalize = (a: number) => Math.round(Math.max(0, Math.min(a, 1)) * 255);

const hex = (x: number, w: number) => {
    const s = x.toString(16);

    return pad.slice(0, w - s.length) + s;
};

/**
 * Minimal and fast HSLᵤᵥ implementation. Returns `#rrggbb` string.
 *
 * @param h HSLᵤᵥ hue (0..360).
 * @param s HSLᵤᵥ saturation (0..100).
 * @param l HSLᵤᵥ lightness (0..100).
 */
export const hsl = (h: number, s: number, l: number) => {
    let p = l + 16;
    let i = p ** 3 / 1560896; // ← `sub1`
    let j: number;
    let x: number;
    let y: number;
    let z: number;
    let m = i > 0.0088564516 ? i : l / 903.2962962; // ← `sub2`
    let n: number;
    let o = Infinity; // ← `c`

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

    l = l <= 8 ? l / 903.2962962 : (p / 116) ** 3; // ← `y`
    m = -(9 * l * m) / ((m - 4) * n - m * n); //      ← `x`
    n = (9 * l - 15 * n * l - n * m) / (3 * n);
    o = 0; //                                         ← `rgb`

    for (i = 0, j = 16; i < 9; j -= 8) {
        p = M[i++] * m + M[i++] * l + M[i++] * n;

        o += (normalize(p <= 0.0031308 ? 12.92 * p : 1.055 * p ** 0.416666666666666685 - 0.055) << j) >>> 0;
    }

    return '#' + hex(o, 6);
};

/**
 * Minimal and fast HSLᵤᵥ implementation with alpha. Returns `#rrggbbaa` string.
 *
 * @param h HSLᵤᵥ hue (0..360).
 * @param s HSLᵤᵥ saturation (0..100).
 * @param l HSLᵤᵥ lightness (0..100).
 * @param a Alpha (0..1).
 */
export const hsla = (h: number, s: number, l: number, a: number) => hsl(h, s, l) + hex(normalize(a), 2);
