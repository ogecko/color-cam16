import { sRGB, XYZ, JMh, JuMuHu, CAM16u } from './types'
import { JMH_whitepoint, XYZ_blackpoint, XYZ_outOfGamut, EPSILONXYZ, EPSILONRGB } from './constants'
import { M16_inv, D_RGB_inv, XYZ_w, A_w, N_bb, c, z, F_L_4, N_c, N_cb, n, label_to_JuMuHu, is_hex_code, is_ucs_label3, is_ucs_label5 } from './utility'
import { radians, elem_mul, unadapt, gamma } from './utility'
import { Hu_to_h, JuMuHu_to_label } from './utility';
import { find_strongest_Mu } from './analysis';
import { hex_to_color } from './transform_fwd'

////////////////////////////////////////////////////////////////////////////////////
//                   Inverse Path CAM16 components to RGB hex value               //
////////////////////////////////////////////////////////////////////////////////////

/**
 * Convert CAM16 components to XYZ
 * @param  JMh Object with CAM16 components { J: lightness[0-100], M: colorfulness[0-52], h: hue angle [0-360] } 
 * @returns - Array[3 x 1] where XYZ tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
 */
export function JMh_to_xyz({ J, M, h }: JMh): XYZ {
    const
        h_rad = radians(h),
        cos_h = Math.cos(h_rad),
        sin_h = Math.sin(h_rad),
        J_root = Math.sqrt(J) * 0.1,
        alpha = (J == 0) ? 0 : (M / F_L_4) / J_root,
        t = Math.pow(alpha * Math.pow(1.64 - Math.pow(0.29, n), -0.73), 10 / 9),
        e_t = 0.25 * (Math.cos(h_rad + 2) + 3.8),
        A = A_w * Math.pow(J_root, 2 / c / z),
        p_1 = 5e4 / 13 * N_c * N_cb * e_t,
        p_2 = A / N_bb,
        r = 23 * (p_2 + 0.305) * t / (23 * p_1 + t * (11 * cos_h + 108 * sin_h)),
        a = r * cos_h,
        b = r * sin_h,
        denom = 1 / 1403,
        RGB_c = <sRGB>[(460 * p_2 + 451 * a + 288 * b) * denom,
        (460 * p_2 - 891 * a - 261 * b) * denom,
        (460 * p_2 - 220 * a - 6300 * b) * denom]
            .map(unadapt),
        XYZ = M16_inv(elem_mul(RGB_c, D_RGB_inv))
    // console.log(`J: ${fp(J)}, M: ${fp(M)}, h: ${fp(h)}, t: ${fp(t)}, p_1: ${fp(p_1)}, p_2: ${fp(p_2)}, r: ${fp(r)}, x: ${fp(XYZ[0])}, y: ${fp(XYZ[1])}, z: ${fp(XYZ[2])}`)
    if ((J >= JMH_whitepoint.J) && (M <= JMH_whitepoint.M)) return XYZ_w
    if (J < EPSILONXYZ) return ((M < EPSILONXYZ) ? XYZ_blackpoint : XYZ_outOfGamut)
    if ((r > 10) || (r < 0)) return XYZ_outOfGamut
    return XYZ;
}


/**
 * Convert CAM16 Uniform Color Space components to CAM16 components
 * @param  JuMuHu - Object with CAM16UCS components { Ju: lightness, Mu: colorfulness, Hu: hue angle [0-360] }
 * @returns  Object with CAM16 components { J: lightness[0-100], M: colorfulness[0-52], h: hue angle [0-360] } 
 */
export function JuMuHu_to_JMh({ Ju, Mu, Hu }: JuMuHu): JMh {
    const M = (Math.exp(Mu * 0.0228) - 1) / 0.0228;
    const J = Ju / (1.7 - 0.007 * Ju);
    const h = Hu_to_h(Hu)
    return { J, M, h };
}


/**
 * Convert CAM16 Uniform Color Space components to XYZ tristimulus values
 * @param  JuMuHu - Object with CAM16UCS components { Ju: lightness, Mu: colorfulness, Hu: hue angle [0-360] }
 * @returns XYZ - Array[3 x 1] where XYZ tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
 */
export function JuMuHu_to_xyz({ Ju, Mu, Hu }: JuMuHu): XYZ {
    return JMh_to_xyz(JuMuHu_to_JMh({ Ju, Mu, Hu }));
}


/**
 * Convert XYZ to sRGB (standard Red Green Blue) CRT color space
 * @param  XYZ - Array[3 x 1] where XYZ tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
 * @returns sRGB - Array[3 x 1] where R, G, B range from [0 to 1]
 */
export function xyz_to_srgb([X, Y, Z]: XYZ): sRGB {
    // Check XYZ gamut
    if ((Math.min(X, Y, Z) < 0) || (X > XYZ_w[0] + EPSILONXYZ) || (Y > XYZ_w[1] + EPSILONXYZ) || (Z > XYZ_w[2] + EPSILONXYZ)) {
        return XYZ_outOfGamut
    }
    const R = + 0.03241003232976359 * X - 0.015373989694887858 * Y - 0.004986158819963629 * Z
    const G = - 0.009692242522025166 * X + 0.01875929983695176 * Y + 0.00041554226340084706 * Z
    const B = + 0.0005563941985197545 * X - 0.0020401120612391 * Y + 0.010571489771875336 * Z
    const srgb = [gamma(R), gamma(G), gamma(B)] as sRGB
    // console.log(`x: ${fp(X)}, y: ${fp(Y)}, z: ${fp(Z)}, R: ${(R)}, G: ${(G)}, B: ${(B)}, sR: ${fp(srgb[0])}, sG: ${fp(srgb[1])}, sB: ${fp(srgb[2])}`)
    // Check RGB gamut without the gamma
    if (Math.max(R, G, B) > 1 + EPSILONRGB || Math.min(R, G, B) < 0 - EPSILONRGB) {
        return XYZ_outOfGamut
    }
    return srgb
}

/**
 * Convert sRGB to CSS RGB Hex value
 * @param  sRGB - Array[3 x 1] where R, G, B range from [0 to 1]
 * @returns - String RGB hex value #RRGGBB eg '#800000' = Maroon
 */
export function srgb_to_hex([R, G, B]: sRGB): string {
    // Check the sRGB gamut
    if (Math.max(R, G, B) > 1 + EPSILONRGB || Math.min(R, G, B) < 0 - EPSILONRGB) {
        // Return no hex color when R, G, or B is out of range [0, 1]
        return ''
    }
    R = Math.round(0xff * R), G = Math.round(0xff * G), B = Math.round(0xff * B);
    return '#' + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}

/**
 * Convert CAM16 Uniform Color Space components to hex color
 * @param  JuMuHu - Object with CAM16UCS components { Ju: lightness, Mu: colorfulness, h: hue angle [0-360] } 
 * @returns - String RGB hex value #RRGGBB eg '#800000' = Maroon, Returns '' when out of Gamut.
 */
export function JuMuHu_to_hex(cam16u: JuMuHu): string {
    const xyz1 = JuMuHu_to_xyz(cam16u)
    const rgb1 = xyz_to_srgb(xyz1)
    return srgb_to_hex(rgb1)
}

/**
 * Convert CAM16 Space components to hex color
 * @param  JHh - Object with CAM16UCS components { J: lightness, M: colorfulness, h: hue angle [0-360] } 
 * @returns - String RGB hex value #RRGGBB eg '#800000' = Maroon
 */
 export function JMh_to_hex(cam16: JMh): string {
    return srgb_to_hex(xyz_to_srgb(JMh_to_xyz(cam16)))
}


/** Convert CAM16 Uniform Color Space components to hex color, label and ingamut flag 
 * @param  {JuMuHu} JuMuHu - Object with CAM16UCS components { Ju: lightness, Mu: colorfulness, h: hue angle [0-360] } 
 * @returns CAM16u - Object with hex color, inGamut flag, labels and cam16u details
 */
export function JuMuHu_to_color(JuMuHu: JuMuHu): CAM16u {
    const result = {
        inGamut: true,
        hex: JuMuHu_to_hex(JuMuHu),
        hexMu: JuMuHu.Mu,
        hexLabel1: '',
        hexLabel2: '',
        ...JuMuHu
    }
    if (result.hex == '') {
        result.inGamut = false
        result.hexMu = find_strongest_Mu(JuMuHu)
        result.hex = JuMuHu_to_hex({ Ju: result.Ju, Mu: result.hexMu, Hu: result.Hu })
    }
    result.hexLabel1 = JuMuHu_to_label({ Ju: result.Ju, Mu: result.hexMu, Hu: result.Hu })
    result.hexLabel2 = JuMuHu_to_label({ Ju: result.Ju, Mu: result.hexMu, Hu: result.Hu }, true)
    return result
}


/** Convert color label (either hex or ucs) to the structured color
 * @param  {string} s - hex or ucs label (3 or 5 char) representing the color
 * @returns {CAM16u} - Object with hex color, inGamut flag, labels and cam16u details
 */
 export function label_to_color(s: string): CAM16u {
    if (is_hex_code(s)) return hex_to_color(s)
    if (is_ucs_label3(s)) return JuMuHu_to_color(label_to_JuMuHu(s))
    if (is_ucs_label5(s)) return JuMuHu_to_color(label_to_JuMuHu(s))

    throw new Error('Bad Input: Must be of form "#DEFACE", "5Z8" or "50Z80"')

}
