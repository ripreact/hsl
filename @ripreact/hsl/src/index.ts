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
    h = (h * Math.PI) / 180;

    let hsin = Math.sin(h);
    let hcos = Math.cos(h);

    const t1 = l + 16;
    const t2 = 13 * l;
    const t3 = t1 / 116;

    const sub1 = (t1 * t1 * t1) / 1560896;
    const sub2 = sub1 > 0.0088564516 ? sub1 : l / 903.2962962;

    let i: number;
    let j: number;
    let cmax = Infinity;

    let m1: number;
    let m2: number;
    let m3: number;

    let bottom: number;
    let length: number;

    for (i = 0; i < 9; ) {
        m1 = M[i++];
        m2 = M[i++];
        m3 = M[i++];

        for (j = 0; j < 2; j++) {
            bottom = (632260 * m3 - q * m2) * sub2 + q * j;

            length =
                ((838422 * m3 + r * m2 + 731718 * m1) * l * sub2 - r * j * l) /
                bottom /
                (hsin - (((284517 * m1 - 94839 * m3) * sub2) / bottom) * hcos);

            if (length >= 0) cmax = Math.min(cmax, length);
        }
    }

    const c = (cmax / 100) * s;

    const varU = (hcos * c) / t2 + 0.19783000664283;
    const varV = (hsin * c) / t2 + 0.46831999493879;

    const y = l <= 8 ? l / 903.2962962 : t3 * t3 * t3;
    const x = (-9 * y * varU) / ((varU - 4) * varV - varU * varV);
    const z = (9 * y - 15 * varV * y - varV * x) / (3 * varV);

    let dot = M[0] * x + M[1] * y + M[2] * z;
    let rgb = normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * dot ** 0.416666666666666685 - 0.055) << 16;

    dot = M[3] * x + M[4] * y + M[5] * z;
    rgb |= normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * dot ** 0.416666666666666685 - 0.055) << 8;

    dot = M[6] * x + M[7] * y + M[8] * z;
    rgb |= normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * dot ** 0.416666666666666685 - 0.055);

    return '#' + hex(rgb, 6);
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
