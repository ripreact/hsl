#include <math.h>
#include <assert.h>
#include <string.h>
#include <stdlib.h>
#include <node_api.h>

const float M[9] = {
     3.240969941904521, -1.537383177570093, -0.498610760293,
    -0.96924363628087,   1.87596750150772,   0.041555057407175,
     0.055630079696993, -0.20397695888897,   1.056971514242878
};

const float a = 126452;
const float b = 769860;

/**
 * Clamps a value to [0; 1] range and then normalizes it to [0; 255] int range.
 */
static inline unsigned int normalize(float a) {
    return lroundf(fminf(1, fmaxf(a, 0)) * 255);
}

/**
 * Calculates dot product of (x, y, z) and M[i], then calculates `fromLinear` for this value,
 * then normalizes value to [0; 255] range.
 */
static inline unsigned int rgb(unsigned int i, float x, float y, float z) {
    float dot = M[i + 0] * x + M[i + 1] * y + M[i + 2] * z;

    return normalize(dot <= 0.0031308 ? 12.92 * dot : 1.055 * powf(dot, 0.416666666666666685) - 0.055);
}

static void hex(unsigned int a, char *s) {
    unsigned long int x = a;

    x = ((x & 0xffff) << 32) | ((x & 0xffff0000) >> 16);
    x = ((x & 0x0000ff000000ff00) >> 8) | (x & 0x000000ff000000ff) << 16;
    x = ((x & 0x00f000f000f000f0) >> 4) | (x & 0x000f000f000f000f) << 8;

    unsigned long int mask = ((x + 0x0606060606060606) >> 4) & 0x0101010101010101;

    x |= 0x3030303030303030;
    x += 0x27 * mask;

    *(unsigned long int *)s = x;
}

/**
 * Minimal and fast HSLᵤᵥ implementation. Returns `rrggbb00` string.
 *
 * @param h HSLᵤᵥ hue (0..360).
 * @param s HSLᵤᵥ saturation (0..100).
 * @param l HSLᵤᵥ lightness (0..100).
 */
static unsigned int hsl_c(float h, float s, float l) {
    h *= 0.017453292519943295;

    float hsin = sinf(h);
    float hcos = cosf(h);
    float c = INFINITY;
    float m1;
    float m2;
    float m3;
    float bottom;
    float l1 = l + 16;
    float l2 = 13 * l;
    float l3 = l1 / 116;
    float sub = (l1 * l1 * l1) / 1560896;
    unsigned int i;

    sub = sub > 0.0088564516 ? sub : l / 903.2962962;

    for (i = 0; i < 9;) {
        m1 = M[i++];
        m2 = M[i++];
        m3 = M[i++];

        for (l1 = 0; l1 < 2; l1++) {
            bottom = (632260 * m3 - a * m2) * sub + a * l1;
            bottom = ((838422 * m3 + b * m2 + 731718 * m1) * l * sub - b * l1 * l) / bottom / (hsin - (((284517 * m1 - 94839 * m3) * sub) / bottom) * hcos);

            if (bottom >= 0) c = fmin(c, bottom);
        }
    }

    c = (c / 100) * s;

    hcos = (hcos * c) / l2 + 0.19783000664283;
    hsin = (hsin * c) / l2 + 0.46831999493879;

    m2 = l <= 8 ? l / 903.2962962 : l3 * l3 * l3;
    c = 9 * m2;
    m1 = (-c * hcos) / ((hcos - 4) * hsin - hcos * hsin);
    m3 = (c - 15 * hsin * m2 - hsin * m1) / (3 * hsin);

    i  = rgb(0, m1, m2, m3) << 16;
    i |= rgb(3, m1, m2, m3) << 8;
    i |= rgb(6, m1, m2, m3);

    return i;
}

/**
 * Minimal and fast HSLᵤᵥ implementation with alpha. Returns `rrggbbaa` unsigned int.
 *
 * @param h HSLᵤᵥ hue (0..360).
 * @param s HSLᵤᵥ saturation (0..100).
 * @param l HSLᵤᵥ lightness (0..100).
 * @param a Alpha (0..1).
 */
static unsigned int hsla_c(float h, float s, float l, float a) {
    return (hsl_c(h, s, l) << 8) | normalize(a);
}

static napi_value hsl_napi(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 3; napi_value args[3]; status = napi_get_cb_info(env, info, &argc, args, NULL, NULL); assert(status == napi_ok);

    if (argc < 3) { napi_throw_type_error(env, NULL, "Wrong number of arguments."); return NULL; }

    napi_valuetype type_h; status = napi_typeof(env, args[0], &type_h); assert(status == napi_ok);
    napi_valuetype type_s; status = napi_typeof(env, args[1], &type_s); assert(status == napi_ok);
    napi_valuetype type_l; status = napi_typeof(env, args[2], &type_l); assert(status == napi_ok);

    if (type_h != napi_number || type_s != napi_number || type_l != napi_number) { napi_throw_type_error(env, NULL, "Wrong arguments."); return NULL; }

    double h; status = napi_get_value_double(env, args[0], &h); assert(status == napi_ok);
    double s; status = napi_get_value_double(env, args[1], &s); assert(status == napi_ok);
    double l; status = napi_get_value_double(env, args[2], &l); assert(status == napi_ok);

    const unsigned int rgb = hsl_c((float)h, (float)s, (float)l);
    char css[8];

    hex(rgb, css);

    css[1] = '#';

    napi_value result; status = napi_create_string_utf8(env, css + 1, NAPI_AUTO_LENGTH, &result); assert(status == napi_ok);

    return result;
};

static napi_value hsla_napi(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 4; napi_value args[4]; status = napi_get_cb_info(env, info, &argc, args, NULL, NULL); assert(status == napi_ok);

    if (argc < 4) { napi_throw_type_error(env, NULL, "Wrong number of arguments."); return NULL; }

    napi_valuetype type_h; status = napi_typeof(env, args[0], &type_h); assert(status == napi_ok);
    napi_valuetype type_s; status = napi_typeof(env, args[1], &type_s); assert(status == napi_ok);
    napi_valuetype type_l; status = napi_typeof(env, args[2], &type_l); assert(status == napi_ok);
    napi_valuetype type_a; status = napi_typeof(env, args[3], &type_a); assert(status == napi_ok);

    if (type_h != napi_number || type_s != napi_number || type_l != napi_number || type_a != napi_number) { napi_throw_type_error(env, NULL, "Wrong arguments."); return NULL; }

    double h; status = napi_get_value_double(env, args[0], &h); assert(status == napi_ok);
    double s; status = napi_get_value_double(env, args[1], &s); assert(status == napi_ok);
    double l; status = napi_get_value_double(env, args[2], &l); assert(status == napi_ok);
    double a; status = napi_get_value_double(env, args[3], &a); assert(status == napi_ok);

    const unsigned int rgba = hsla_c((float)h, (float)s, (float)l, (float)a);
    char css[9];

    css[0] = '#';

    hex(rgba, css + 1);

    napi_value result; status = napi_create_string_utf8(env, css, NAPI_AUTO_LENGTH, &result); assert(status == napi_ok);

    return result;
};

static napi_value init(napi_env env, napi_value exports) {
    napi_status status;

    napi_value hsl_js;  status = napi_create_function(env, NULL, 0, hsl_napi, NULL,  &hsl_js);  assert(status == napi_ok);
    napi_value hsla_js; status = napi_create_function(env, NULL, 0, hsla_napi, NULL, &hsla_js); assert(status == napi_ok);

    status = napi_set_named_property(env, exports, "hsl",  hsl_js);  assert(status == napi_ok);
    status = napi_set_named_property(env, exports, "hsla", hsla_js); assert(status == napi_ok);

    return exports;
}

NAPI_MODULE(hello, init)
