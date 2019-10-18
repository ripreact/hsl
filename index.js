/**
 * Minimal HSLᵤᵥ implementation. Returns `rgba(r,g,b,a)` string.
 *
 * @param {number} h HSLᵤᵥ hue.
 * @param {number} s HSLᵤᵥ saturation.
 * @param {number} l HSLᵤᵥ lightness.
 * @param {number} [a] Alpha.
 */
module.exports.hsl = (h, s, l, a = 1) => {
    /** @type {number} */
    let j;

    /** @type {number} */
    let bottom;

    /** @type {number} */
    let length;

    /** @type {number[][]} */
    const M = [
        [3.240969941904521, -1.537383177570093, -0.498610760293],
        [-0.96924363628087, 1.87596750150772, 0.041555057407175],
        [0.055630079696993, -0.20397695888897, 1.056971514242878],
    ];

    /**
     * @param {number} c
     * @returns {number}
     */
    const fromLinear = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** 0.416666666666666685 - 0.055);

    const { sin, cos, min } = Math;

    /** @type {number} */
    const hrad = (h * Math.PI) / 180;

    /** @type {number[][]} */
    const bounds = [];

    /** @type {number} */
    const sub1 = (l + 16) ** 3 / 1560896;

    /** @type {number} */
    const sub2 = sub1 > 0.0088564516 ? sub1 : l / 903.2962962;

    const _ = M.map(
        /**
         * @param {number} a
         * @param {number} b
         * @param {number} c
         */
        ([a, b, c]) => {
            for (j = 0; j < 2; j++) {
                bottom = (632260 * c - 126452 * b) * sub2 + 126452 * j;

                bounds.push([
                    ((284517 * a - 94839 * c) * sub2) / bottom,
                    ((838422 * c + 769860 * b + 731718 * a) * l * sub2 - 769860 * j * l) / bottom,
                ]);
            }
        },
    );

    /** @type {number} */
    const c = bounds.reduce(
        /**
         * @param {number} result
         * @param {number} a
         * @param {number} b
         * @returns {number}
         */
        (result, [a, b]) => {
            length = b / (sin(hrad) - a * cos(hrad));

            return length >= 0 ? min(result, (length / 100) * s) : result;
        },
        Infinity,
    );

    /** @type {number} */
    const varU = (cos(hrad) * c) / (13 * l) + 0.19783000664283;

    /** @type {number} */
    const varV = (sin(hrad) * c) / (13 * l) + 0.46831999493879;

    /** @type {number} */
    const y = l <= 8 ? l / 903.2962962 : ((l + 16) / 116) ** 3;

    /** @type {number} */
    const x = -(9 * y * varU) / ((varU - 4) * varV - varU * varV);

    return `rgba(${M.map(
        /**
         * @param {number} a
         * @param {number} b
         * @param {number} c
         * @returns {number}
         */
        ([a, b, c]) => {
            return Math.round(
                Math.max(0, min(fromLinear(a * x + b * y + (c * (9 * y - 15 * varV * y - varV * x)) / (3 * varV)), 1)) *
                    255,
            );
        },
    )},${a})`;
};
