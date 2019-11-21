#include <math.h>;

#define M_PI 3.14159265358979323846

float M[9] = {
    3.240969941904521,
    -1.537383177570093,
    -0.498610760293,

    -0.96924363628087,
    1.87596750150772,
    0.041555057407175,

    0.055630079696993,
    -0.20397695888897,
    1.056971514242878
};

float q = 126452;
float r = 769860;

static unsigned int normalize(float a) {
    return fround(fmax(0, fmin(a, 1)) * 255);
}

/**
 * Minimal and fast HSLᵤᵥ implementation. Returns `00rrggbb` int.
 *
 * @param h HSLᵤᵥ hue (0..360).
 * @param s HSLᵤᵥ saturation (0..100).
 * @param l HSLᵤᵥ lightness (0..100).
 */
unsigned int hsl(float h, float s, float l) {
    h = (h * M_PI) / 180;

    float hsin = sinf(h);
    float hcos = cosf(h);

    float t1 = l + 16;
    float t2 = 13 * l;
    float t3 = t1 / 116;

    float sub1 = (t1 * t1 * t1) / 1560896;
    float sub2 = sub1 > 0.0088564516 ? sub1 : l / 903.2962962;

    unsigned int i;
    float j;
    float cmax = INFINITY;

    float m1;
    float m2;
    float m3;

    float bottom;
    float length;

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

            if (length >= 0) cmax = fmin(cmax, length);
        }
    }

    float c = (cmax / 100) * s;

    float varU = (hcos * c) / t2 + 0.19783000664283;
    float varV = (hsin * c) / t2 + 0.46831999493879;

    float y = l <= 8 ? l / 903.2962962 : t3 * t3 * t3;
    float x = (-9 * y * varU) / ((varU - 4) * varV - varU * varV);
    float z = (9 * y - 15 * varV * y - varV * x) / (3 * varV);

    unsigned int dot = M[0] * x + M[1] * y + M[2] * z;
    unsigned int rgb = normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * powf(dot, 0.416666666666666685) - 0.055) << 16;

    dot = M[3] * x + M[4] * y + M[5] * z;
    rgb |= normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * powf(dot, 0.416666666666666685) - 0.055) << 8;

    dot = M[6] * x + M[7] * y + M[8] * z;
    rgb |= normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * powf(dot, 0.416666666666666685) - 0.055);

    return rgb;
};
