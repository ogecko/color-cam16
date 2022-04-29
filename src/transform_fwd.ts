import { sRGB, XYZ, JMhQCs, JMh, CAM16u, JuMuHu } from './types'
import { M16, A_w, D_RGB, N_bb, c, z, F_L_4, N_c, N_cb, n } from './utility'
import { degrees, radians, is_hex_code, gamma_inverse, elem_mul, adapt } from './utility'
import { h_to_Hu, JuMuHu_to_label } from './utility';

////////////////////////////////////////////////////////////////////////////////////
//                   Forward Path CSS RGB Hex to CAM16 components                 //
////////////////////////////////////////////////////////////////////////////////////

/**
 * Convert CSS RGB Hex value to an sRGB array
 * @param  {string} hex - String RGB hex value #RRGGBB eg '#800000' = Maroon
 * @returns sRGB - Array[3 x 1] where R, G, B range from [0 to 1]
 */
export function hex_to_srgb(hex: string): sRGB {
    if (! is_hex_code(hex)) {
        throw new Error('Bad Input: Must be of form "666FAD" or "#DEFACE"');
    }
    const RGB = parseInt(hex.slice(-6), 16);
    return [
        (RGB >> 16) / 0xff,             // first byte  -> R
        (RGB >> 8 & 0xff) / 0xff,       // second byte -> G
        (RGB & 0xff) / 0xff];           // third byte  -> B
}

/**
 * Convert sRGB to XYZ tristimulus values
 * @param  sRGB - Array[3 x 1] where R, G, B range from [0 to 1]
 * @returns XYZ - Array[3 x 1] where XYZ tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
 */
    export function srgb_to_xyz([R, G, B]: sRGB): XYZ {
    R = gamma_inverse(R), G = gamma_inverse(G), B = gamma_inverse(B);
    return [
        41.23865632529916 * R + 35.75914909206253 * G + 18.045049120356364 * B,
        21.26368216773238 * R + 71.51829818412506 * G + 7.218019648142546 * B,
        1.9330620152483982 * R + 11.919716364020843 * G + 95.03725870054352 * B
    ]
}

/**
 * Convert XYZ value to CAM16 components
* @param  XYZ - Array[3 x 1] where XYZ tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
* @returns JMhQCs - Object with CAM16 components { J: lightness[0-100] , Q: brightness[0-198], C: chroma[0-113], M: colorfulness[0-100], s: saturation[0-86], h: hue angle [0-360] }
*/
    export function xyz_to_JMhQCs(XYZ: XYZ): JMhQCs {
    const
        [R_a, G_a, B_a] = elem_mul(M16(XYZ), D_RGB).map(adapt),
        a = R_a + (-12 * G_a + B_a) / 11,          // redness-greenness
        b = (R_a + G_a - 2 * B_a) / 9,             // yellowness-blueness
        h_rad = Math.atan2(b, a),                  // hue in radians
        h = degrees(h_rad),                        // hue in degrees
        e_t = 0.25 * (Math.cos(h_rad + 2) + 3.8),
        A = N_bb * (2 * R_a + G_a + 0.05 * B_a),
        J_root = Math.pow(A / A_w, 0.5 * c * z),
        J = 100 * J_root * J_root,                 // lightness
        Q = (4 / c * J_root * (A_w + 4) * F_L_4),  // brightness
        t = (5e4 / 13 * N_c * N_cb * e_t * Math.sqrt(a * a + b * b) /
            (R_a + G_a + 1.05 * B_a + 0.305)),
        alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, n), 0.73),
        C = alpha * J_root,                        // chroma
        M = C * F_L_4,                             // colorfulness
        s = 50 * Math.sqrt(c * alpha / (A_w + 4)); // saturation
    return { J, Q, C, M, s, h }
}

/**
 * Convert cam16 JMh to cam16 uniform color space Ju, Mu, a and b
 * @param  JMH - Object with CAM16 components { J: lightness[0-100], M: colorfulness[0-52], h: hue angle [0-360] } 
 * @returns JuMuab - Object with CAM16 UCS components Ju: uniform lightness[0-100], Mu: uniform colorfulness[0-100], a: magenta-teal, b: yellow-blue }
 */
export function JMH_to_JuMuHu({ J , M, h }:JMh) {
    const h_rad = radians(h);
    const Mu = Math.log(1 + 0.0228 * M) / 0.0228;
    return {
        Ju: 1.7 * J / (1 + 0.007 * J),
        Mu,
        Hu: h_to_Hu(h),
    };
}

/**
 * Convert XYZ value to CAM16 Uniform Color Space components
 * @param  {XYZ} XYZ - Array[3 x 1] where XYZ tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
 * @returns - Object with CAM16 components Ju: lightness , Mu: colorfulness, a: magenta-teal, b: yellow-blue }
 */
export function xyz_to_JuMuHu(XYZ: XYZ): JuMuHu {
    const { J, Q, C, M, s, h } = xyz_to_JMhQCs(XYZ)
    const { Ju, Mu, Hu } = JMH_to_JuMuHu({ J, M, h })
    return {
        Ju, Mu, Hu
    };
}

/**
 * Convert CSS RGB Hex value to CAM16 components
 * @param  {string} hex - String RGB hex value #RRGGBB eg '#800000' = Maroon
 * @returns JMhQCs - Object with CAM16 components { J: lightness , Q: brightness, C: chroma, M: colorfulness, s: saturation, h: hue angle [0-360] }
 */
export function hex_to_JMhQCs(hex: string): JMhQCs {
    const XYZ = srgb_to_xyz(hex_to_srgb(hex))
    return xyz_to_JMhQCs(XYZ)
}


/**
 * Convert CSS RGB Hex value to CAM16 Uniform Color Space components
 * @param  {string} hex - String RGB hex value #RRGGBB eg '#800000' = Maroon
 * @returns - Object with CAM16 UCS components { Ju: lightness , Mu: colorfulness, a: magenta-teal, b: yellow-blue }
 */
export function hex_to_JuMuHu(hex: string): JuMuHu {
    const XYZ = srgb_to_xyz(hex_to_srgb(hex))
    return xyz_to_JuMuHu(XYZ)
}

/**
 * Convert CSS RGB Hex value to CAM16 Uniform Color Space components and return as an Object
 * @param  {string} hex - String RGB hex value #RRGGBB eg '#800000' = Maroon
 * @returns - Object with CAM16 UCS components and original hex { Ju: lightness , Mu: colorfulness, Hu: hue angle, hex: sRGB color, inGamut: true }
 */
export function hex_to_color(hex: string): CAM16u {
    const { Ju, Mu, Hu } = hex_to_JuMuHu(hex)
    return { 
        Ju, Mu, Hu, hex, 
        inGamut: true, 
        hexMu: Mu,
        hexLabel1: JuMuHu_to_label({ Ju, Mu, Hu }),
        hexLabel2: JuMuHu_to_label({ Ju, Mu, Hu }, true)
    }
}
