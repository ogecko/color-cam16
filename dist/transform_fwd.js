"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hex_to_color = exports.hex_to_JuMuHu = exports.hex_to_JMhQCs = exports.xyz_to_JuMuHu = exports.JMH_to_JuMuHu = exports.xyz_to_JMhQCs = exports.srgb_to_xyz = exports.hex_to_srgb = void 0;
const utility_1 = require("./utility");
const utility_2 = require("./utility");
const utility_3 = require("./utility");
function hex_to_srgb(hex) {
    if (!(0, utility_2.is_hex_code)(hex)) {
        throw new Error('Bad Input: Must be of form "666FAD" or "#DEFACE"');
    }
    const RGB = parseInt(hex.slice(-6), 16);
    return [
        (RGB >> 16) / 0xff,
        (RGB >> 8 & 0xff) / 0xff,
        (RGB & 0xff) / 0xff
    ];
}
exports.hex_to_srgb = hex_to_srgb;
function srgb_to_xyz([R, G, B]) {
    R = (0, utility_2.gamma_inverse)(R), G = (0, utility_2.gamma_inverse)(G), B = (0, utility_2.gamma_inverse)(B);
    return [
        41.23865632529916 * R + 35.75914909206253 * G + 18.045049120356364 * B,
        21.26368216773238 * R + 71.51829818412506 * G + 7.218019648142546 * B,
        1.9330620152483982 * R + 11.919716364020843 * G + 95.03725870054352 * B
    ];
}
exports.srgb_to_xyz = srgb_to_xyz;
function xyz_to_JMhQCs(XYZ) {
    const [R_a, G_a, B_a] = (0, utility_2.elem_mul)((0, utility_1.M16)(XYZ), utility_1.D_RGB).map(utility_2.adapt), a = R_a + (-12 * G_a + B_a) / 11, b = (R_a + G_a - 2 * B_a) / 9, h_rad = Math.atan2(b, a), h = (0, utility_2.degrees)(h_rad), e_t = 0.25 * (Math.cos(h_rad + 2) + 3.8), A = utility_1.N_bb * (2 * R_a + G_a + 0.05 * B_a), J_root = Math.pow(A / utility_1.A_w, 0.5 * utility_1.c * utility_1.z), J = 100 * J_root * J_root, Q = (4 / utility_1.c * J_root * (utility_1.A_w + 4) * utility_1.F_L_4), t = (5e4 / 13 * utility_1.N_c * utility_1.N_cb * e_t * Math.sqrt(a * a + b * b) /
        (R_a + G_a + 1.05 * B_a + 0.305)), alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, utility_1.n), 0.73), C = alpha * J_root, M = C * utility_1.F_L_4, s = 50 * Math.sqrt(utility_1.c * alpha / (utility_1.A_w + 4));
    return { J, Q, C, M, s, h };
}
exports.xyz_to_JMhQCs = xyz_to_JMhQCs;
function JMH_to_JuMuHu({ J, M, h }) {
    const h_rad = (0, utility_2.radians)(h);
    const Mu = Math.log(1 + 0.0228 * M) / 0.0228;
    return {
        Ju: 1.7 * J / (1 + 0.007 * J),
        Mu,
        Hu: (0, utility_3.h_to_Hu)(h),
    };
}
exports.JMH_to_JuMuHu = JMH_to_JuMuHu;
function xyz_to_JuMuHu(XYZ) {
    const { J, Q, C, M, s, h } = xyz_to_JMhQCs(XYZ);
    const { Ju, Mu, Hu } = JMH_to_JuMuHu({ J, M, h });
    return {
        Ju, Mu, Hu
    };
}
exports.xyz_to_JuMuHu = xyz_to_JuMuHu;
function hex_to_JMhQCs(hex) {
    const XYZ = srgb_to_xyz(hex_to_srgb(hex));
    return xyz_to_JMhQCs(XYZ);
}
exports.hex_to_JMhQCs = hex_to_JMhQCs;
function hex_to_JuMuHu(hex) {
    const XYZ = srgb_to_xyz(hex_to_srgb(hex));
    return xyz_to_JuMuHu(XYZ);
}
exports.hex_to_JuMuHu = hex_to_JuMuHu;
function hex_to_color(hex) {
    const { Ju, Mu, Hu } = hex_to_JuMuHu(hex);
    return {
        Ju, Mu, Hu, hex,
        inGamut: true,
        hexMu: Mu,
        hexLabel1: (0, utility_3.JuMuHu_to_label)({ Ju, Mu, Hu }),
        hexLabel2: (0, utility_3.JuMuHu_to_label)({ Ju, Mu, Hu }, true)
    };
}
exports.hex_to_color = hex_to_color;
//# sourceMappingURL=transform_fwd.js.map