"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iheH = exports.standard_whitepoints = exports.EPSILONXYZ = exports.EPSILONRGB = exports.RADIANS = exports.DEGREES = exports.JMH_whitepoint = exports.XYZ_blackpoint = exports.XYZ_outOfGamut = void 0;
exports.XYZ_outOfGamut = [950, 950, 950];
exports.XYZ_blackpoint = [0, 0, 0];
exports.JMH_whitepoint = { J: 99.99955537650459, M: 1.9077118865272156, h: 209.49854407518322 };
exports.DEGREES = 180 / Math.PI;
exports.RADIANS = Math.PI / 180;
exports.EPSILONRGB = 0.0002;
exports.EPSILONXYZ = 0.5;
exports.standard_whitepoints = {
    A: [109.850, 100, 35.585],
    B: [99.090, 100, 85.324],
    C: [98.074, 100, 118.232],
    E: [100, 100, 100],
    D50: [96.422, 100, 82.521],
    D55: [95.682, 100, 92.149],
    D65: [95.047, 100, 108.883],
    D75: [94.972, 100, 122.638],
    F2: [99.186, 100, 67.393],
    F7: [95.041, 100, 108.747],
    F11: [100.962, 100, 64.350],
};
exports.iheH = [
    { i: 1, h: 20.14, e: 0.8, H: 0 },
    { i: 2, h: 90.00, e: 0.7, H: 100 },
    { i: 3, h: 164.25, e: 1.0, H: 200 },
    { i: 4, h: 237.53, e: 1.2, H: 300 },
    { i: 5, h: 380.14, e: 0.8, H: 400 },
];
//# sourceMappingURL=constants.js.map