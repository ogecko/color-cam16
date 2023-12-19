"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.label_to_color = exports.JuMuHu_to_color = exports.JMh_to_hex = exports.JuMuHu_to_hex = exports.srgb_to_hex = exports.xyz_to_srgb = exports.JuMuHu_to_xyz = exports.JuMuHu_to_JMh = exports.JMh_to_xyz = void 0;
const constants_1 = require("./constants");
const utility_1 = require("./utility");
const utility_2 = require("./utility");
const utility_3 = require("./utility");
const analysis_1 = require("./analysis");
const transform_fwd_1 = require("./transform_fwd");
function JMh_to_xyz({ J, M, h }) {
    const h_rad = (0, utility_2.radians)(h), cos_h = Math.cos(h_rad), sin_h = Math.sin(h_rad), J_root = Math.sqrt(J) * 0.1, alpha = (J == 0) ? 0 : (M / utility_1.F_L_4) / J_root, t = Math.pow(alpha * Math.pow(1.64 - Math.pow(0.29, utility_1.n), -0.73), 10 / 9), e_t = 0.25 * (Math.cos(h_rad + 2) + 3.8), A = utility_1.A_w * Math.pow(J_root, 2 / utility_1.c / utility_1.z), p_1 = 5e4 / 13 * utility_1.N_c * utility_1.N_cb * e_t, p_2 = A / utility_1.N_bb, r = 23 * (p_2 + 0.305) * t / (23 * p_1 + t * (11 * cos_h + 108 * sin_h)), a = r * cos_h, b = r * sin_h, denom = 1 / 1403, RGB_c = [(460 * p_2 + 451 * a + 288 * b) * denom,
        (460 * p_2 - 891 * a - 261 * b) * denom,
        (460 * p_2 - 220 * a - 6300 * b) * denom]
        .map(utility_2.unadapt), XYZ = (0, utility_1.M16_inv)((0, utility_2.elem_mul)(RGB_c, utility_1.D_RGB_inv));
    if ((J >= constants_1.JMH_whitepoint.J) && (M <= constants_1.JMH_whitepoint.M))
        return utility_1.XYZ_w;
    if (J < constants_1.EPSILONXYZ)
        return ((M < constants_1.EPSILONXYZ) ? constants_1.XYZ_blackpoint : constants_1.XYZ_outOfGamut);
    if ((r > 10) || (r < 0))
        return constants_1.XYZ_outOfGamut;
    return XYZ;
}
exports.JMh_to_xyz = JMh_to_xyz;
function JuMuHu_to_JMh({ Ju, Mu, Hu }) {
    const M = (Math.exp(Mu * 0.0228) - 1) / 0.0228;
    const J = Ju / (1.7 - 0.007 * Ju);
    const h = (0, utility_3.Hu_to_h)(Hu);
    return { J, M, h };
}
exports.JuMuHu_to_JMh = JuMuHu_to_JMh;
function JuMuHu_to_xyz({ Ju, Mu, Hu }) {
    return JMh_to_xyz(JuMuHu_to_JMh({ Ju, Mu, Hu }));
}
exports.JuMuHu_to_xyz = JuMuHu_to_xyz;
function xyz_to_srgb([X, Y, Z]) {
    if ((Math.min(X, Y, Z) < 0) || (X > utility_1.XYZ_w[0] + constants_1.EPSILONXYZ) || (Y > utility_1.XYZ_w[1] + constants_1.EPSILONXYZ) || (Z > utility_1.XYZ_w[2] + constants_1.EPSILONXYZ)) {
        return constants_1.XYZ_outOfGamut;
    }
    const R = +0.03241003232976359 * X - 0.015373989694887858 * Y - 0.004986158819963629 * Z;
    const G = -0.009692242522025166 * X + 0.01875929983695176 * Y + 0.00041554226340084706 * Z;
    const B = +0.0005563941985197545 * X - 0.0020401120612391 * Y + 0.010571489771875336 * Z;
    const srgb = [(0, utility_2.gamma)(R), (0, utility_2.gamma)(G), (0, utility_2.gamma)(B)];
    if (Math.max(R, G, B) > 1 + constants_1.EPSILONRGB || Math.min(R, G, B) < 0 - constants_1.EPSILONRGB) {
        return constants_1.XYZ_outOfGamut;
    }
    return srgb;
}
exports.xyz_to_srgb = xyz_to_srgb;
function srgb_to_hex([R, G, B]) {
    if (Math.max(R, G, B) > 1 + constants_1.EPSILONRGB || Math.min(R, G, B) < 0 - constants_1.EPSILONRGB) {
        return '';
    }
    R = Math.round(0xff * R), G = Math.round(0xff * G), B = Math.round(0xff * B);
    return '#' + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}
exports.srgb_to_hex = srgb_to_hex;
function JuMuHu_to_hex(cam16u) {
    const xyz1 = JuMuHu_to_xyz(cam16u);
    const rgb1 = xyz_to_srgb(xyz1);
    return srgb_to_hex(rgb1);
}
exports.JuMuHu_to_hex = JuMuHu_to_hex;
function JMh_to_hex(cam16) {
    return srgb_to_hex(xyz_to_srgb(JMh_to_xyz(cam16)));
}
exports.JMh_to_hex = JMh_to_hex;
function JuMuHu_to_color(JuMuHu) {
    const result = Object.assign({ inGamut: true, hex: JuMuHu_to_hex(JuMuHu), hexMu: JuMuHu.Mu, hexLabel1: '', hexLabel2: '' }, JuMuHu);
    if (result.hex == '') {
        result.inGamut = false;
        result.hexMu = (0, analysis_1.find_strongest_Mu)(JuMuHu);
        result.hex = JuMuHu_to_hex({ Ju: result.Ju, Mu: result.hexMu, Hu: result.Hu });
    }
    result.hexLabel1 = (0, utility_3.JuMuHu_to_label)({ Ju: result.Ju, Mu: result.hexMu, Hu: result.Hu });
    result.hexLabel2 = (0, utility_3.JuMuHu_to_label)({ Ju: result.Ju, Mu: result.hexMu, Hu: result.Hu }, true);
    return result;
}
exports.JuMuHu_to_color = JuMuHu_to_color;
function label_to_color(s) {
    if ((0, utility_1.is_hex_code)(s))
        return (0, transform_fwd_1.hex_to_color)(s);
    if ((0, utility_1.is_ucs_label3)(s))
        return JuMuHu_to_color((0, utility_1.label_to_JuMuHu)(s));
    if ((0, utility_1.is_ucs_label5)(s))
        return JuMuHu_to_color((0, utility_1.label_to_JuMuHu)(s));
    throw new Error('Bad Input: Must be of form "#DEFACE", "5Z8" or "50Z80"');
}
exports.label_to_color = label_to_color;
//# sourceMappingURL=transform_rev.js.map