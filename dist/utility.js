"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuHu_to_ab = exports.label_to_JuMuHu = exports.JuMuHu_to_label = exports.label_to_Hu = exports.Hu_to_label = exports.Hu_to_h = exports.h_to_Hu = exports.A_w = exports.RGB_aw = exports.RGB_cw = exports.D_RGB_inv = exports.D_RGB = exports.RGB_w = exports.unadapt = exports.adapt = exports.D = exports.N_cb = exports.N_bb = exports.z = exports.n = exports.F_L_4 = exports.F_L = exports.k4 = exports.k = exports.N_c = exports.F = exports.c = exports.Y_w = exports.Y_b = exports.L_A = exports.XYZ_w = exports.params = exports.M16_inv = exports.M16 = exports.gamma_inverse = exports.gamma = exports.is_ucs_white = exports.is_ucs_label5 = exports.is_ucs_label3 = exports.is_hex_code = exports.elem_mul = exports.radians = exports.degrees = exports.clip = exports.mod = exports.sgn = exports.lerp = exports.c360 = exports.fp = void 0;
const constants_1 = require("./constants");
const fp = (x) => x.toFixed(2);
exports.fp = fp;
const c360 = (h) => (h + 360) % 360;
exports.c360 = c360;
const lerp = (a, b, t) => (1 - t) * a + t * b;
exports.lerp = lerp;
const sgn = (x) => (x > 0) ? 1 : (x < 0) ? -1 : 0;
exports.sgn = sgn;
const mod = (a, b) => a - b * Math.floor(a / b);
exports.mod = mod;
const clip = (a, b, x) => Math.min(Math.max(x, a), b);
exports.clip = clip;
const degrees = (angle) => (0, exports.mod)(angle * constants_1.DEGREES, 360);
exports.degrees = degrees;
const radians = (angle) => (0, exports.mod)(angle, 360) * constants_1.RADIANS;
exports.radians = radians;
const elem_mul = ([a, b, c], [x, y, z]) => [a * x, b * y, c * z];
exports.elem_mul = elem_mul;
const is_hex_code = (s) => /^#?[0-9a-fA-F]{6}$/.test(s);
exports.is_hex_code = is_hex_code;
const is_ucs_label3 = (s) => /^[W0-9][a-zA-Z][0-9]$/.test(s);
exports.is_ucs_label3 = is_ucs_label3;
const is_ucs_label5 = (s) => /^[W0-9]{2}[a-zA-Z][0-9]{2}$/.test(s);
exports.is_ucs_label5 = is_ucs_label5;
const is_ucs_white = (s) => /^W/.test(s);
exports.is_ucs_white = is_ucs_white;
const gamma = (x) => (x <= 0) ? 0 :
    (x > 0.0031308) ? (1.055 * Math.pow(x, 0.4166666666666667) - 0.055)
        : 12.92 * x;
exports.gamma = gamma;
const gamma_inverse = (x) => (x > 0.04045) ? Math.pow((x + 0.055) * 0.9478672985781991, 2.4)
    : 0.07739938080495357 * x;
exports.gamma_inverse = gamma_inverse;
const M16 = ([X, Y, Z]) => [
    +0.401288 * X + 0.650173 * Y - 0.051461 * Z,
    -0.250268 * X + 1.204414 * Y + 0.045854 * Z,
    -0.002079 * X + 0.048952 * Y + 0.953127 * Z
];
exports.M16 = M16;
const M16_inv = ([R, G, B]) => [
    +1.862067855087233e+0 * R - 1.011254630531685e+0 * G + 1.491867754444518e-1 * B,
    +3.875265432361372e-1 * R + 6.214474419314753e-1 * G - 8.973985167612518e-3 * B,
    -1.584149884933386e-2 * R - 3.412293802851557e-2 * G + 1.049964436877850e+0 * B
];
exports.M16_inv = M16_inv;
exports.params = ({
    whitepoint: constants_1.standard_whitepoints.D65,
    adapting_luminance: 50,
    background_luminance: 75,
    surround: 2,
    discounting: false
});
exports.XYZ_w = exports.params.whitepoint;
exports.L_A = exports.params.adapting_luminance;
exports.Y_b = exports.params.background_luminance;
exports.Y_w = exports.XYZ_w[1];
exports.c = exports.params.surround >= 1
    ? (0, exports.lerp)(0.59, 0.69, exports.params.surround - 1)
    : (0, exports.lerp)(0.525, 0.59, exports.params.surround);
exports.F = exports.c >= 0.59
    ? (0, exports.lerp)(0.9, 1.0, (exports.c - 0.59) / .1)
    : (0, exports.lerp)(0.8, 0.9, (exports.c - 0.525) / 0.065);
exports.N_c = exports.F;
exports.k = 1 / (5 * exports.L_A + 1);
exports.k4 = exports.k * exports.k * exports.k * exports.k;
exports.F_L = (exports.k4 * exports.L_A + 0.1 * (1 - exports.k4) * (1 - exports.k4) * Math.pow(5 * exports.L_A, 1 / 3));
exports.F_L_4 = Math.pow(exports.F_L, 0.25);
exports.n = exports.Y_b / exports.Y_w;
exports.z = 1.48 + Math.sqrt(exports.n);
exports.N_bb = 0.725 * Math.pow(exports.n, -0.2);
exports.N_cb = exports.N_bb;
exports.D = !exports.params.discounting
    ? (0, exports.clip)(0, 1, exports.F * (1 - 1 / 3.6 * Math.exp((-exports.L_A - 42) / 92)))
    : 1;
const exponent = 1 / 0.42;
const constant = 100 / exports.F_L * Math.pow(27.13, exponent);
const adapt = (component) => {
    const x = Math.pow(exports.F_L * Math.abs(component) * 0.01, 0.42);
    return (0, exports.sgn)(component) * 400 * x / (x + 27.13);
};
exports.adapt = adapt;
const unadapt = (component) => {
    const cabs = Math.abs(component);
    return (0, exports.sgn)(component) * constant * Math.pow(cabs / (400 - cabs), exponent);
};
exports.unadapt = unadapt;
exports.RGB_w = (0, exports.M16)(exports.XYZ_w);
exports.D_RGB = exports.RGB_w.map(C_w => (0, exports.lerp)(1, exports.Y_w / C_w, exports.D));
exports.D_RGB_inv = exports.D_RGB.map(D_C => 1 / D_C);
exports.RGB_cw = [exports.RGB_w[0] * exports.D_RGB[0], exports.RGB_w[1] * exports.D_RGB[1], exports.RGB_w[2] * exports.D_RGB[2]];
exports.RGB_aw = exports.RGB_cw.map(exports.adapt);
exports.A_w = exports.N_bb * (2 * exports.RGB_aw[0] + exports.RGB_aw[1] + 0.05 * exports.RGB_aw[2]);
function h_to_Hu(hin) {
    const hinn = (hin + 360) % 360;
    const h = (hinn < 20.14) ? hinn + 360 : hinn;
    const i = (h < 90) ? 0 : (h < 164.25) ? 1 : (h < 237.53) ? 2 : 3;
    const di = constants_1.iheH[i];
    const di1 = constants_1.iheH[i + 1];
    const Hu = di.H + (100 * di1.e * (h - di.h)) / (di1.e * (h - di.h) + di.e * (di1.h - h));
    return ((Hu + 400) % 400) / 400 * 360;
}
exports.h_to_Hu = h_to_Hu;
function Hu_to_h(Hu) {
    const H = ((Hu + 360) % 360) / 360 * 400;
    const i = (H < 100) ? 0 : (H < 200) ? 1 : (H < 300) ? 2 : 3;
    const di = constants_1.iheH[i];
    const di1 = constants_1.iheH[i + 1];
    const h = ((H - di.H) * (di1.e * di.h - di.e * di1.h) - 100 * di.h * di1.e) / ((H - di.H) * (di1.e - di.e) - 100 * di1.e);
    return (h + 360) % 360;
}
exports.Hu_to_h = Hu_to_h;
function Hu_to_label(Hu) {
    const alpha = ((Hu + 60) % 180) / 180 * 26;
    const lower = ((Hu + 60) % 360) >= 180 ? 32 : 0;
    return String.fromCharCode(65 + alpha + lower);
}
exports.Hu_to_label = Hu_to_label;
function label_to_Hu(s) {
    const code = s.charCodeAt(0);
    return (64 < code && code < 73) ? (code - 73 + 52) * 180 / 26 :
        (code < 91) ? (code - 73) * 180 / 26 :
            (96 < code && code < 123) ? (code - 105 + 26) * 180 / 26 : 0;
}
exports.label_to_Hu = label_to_Hu;
function JuMuHu_to_label(c, precise = false) {
    const divisor = precise ? 1 : 10;
    return Math.round(c.Ju / divisor) + Hu_to_label(c.Hu) + Math.round(c.Mu * 2 / divisor);
}
exports.JuMuHu_to_label = JuMuHu_to_label;
function label_to_JuMuHu(s) {
    if ((0, exports.is_ucs_label3)(s)) {
        return {
            Ju: (0, exports.is_ucs_white)(s) ? 100 : parseInt(s.slice(0, 1)) * 10,
            Mu: parseInt(s.slice(2, 3)) / 2 * 10,
            Hu: label_to_Hu(s.slice(1, 2)),
        };
    }
    if ((0, exports.is_ucs_label5)(s)) {
        return {
            Ju: (0, exports.is_ucs_white)(s) ? 100 : parseInt(s.slice(0, 2)),
            Mu: parseInt(s.slice(3, 5)) / 2,
            Hu: label_to_Hu(s.slice(2, 3)),
        };
    }
    return { Ju: 0, Mu: 0, Hu: 0 };
}
exports.label_to_JuMuHu = label_to_JuMuHu;
function MuHu_to_ab({ Mu, Hu }) {
    const hu_rad = (0, exports.radians)(Hu);
    return {
        a: Mu * Math.cos(hu_rad),
        b: Mu * Math.sin(hu_rad),
    };
}
exports.MuHu_to_ab = MuHu_to_ab;
//# sourceMappingURL=utility.js.map