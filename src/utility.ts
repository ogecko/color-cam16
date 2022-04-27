import { XYZ, sRGB, JuMuHu, CAM16u } from "./types"
import { DEGREES, RADIANS, standard_whitepoints, iheH } from "./constants"

// Utility Functions
export const fp = (x:number):string => x.toFixed(2)
export const c360 = (h:number) => (h + 360) % 360       // normalise signed hue values (eg -356..920) to positive range of 0..359
export const lerp = (a:number, b:number, t:number) => (1 - t) * a + t * b // Linear interpolation
export const sgn = (x:number) => (x > 0) ? 1 : (x < 0) ? -1 : 0
export const mod = (a:number, b:number) => a - b * Math.floor(a / b)
export const clip = (a:number, b:number, x:number) => Math.min(Math.max(x, a), b)
export const degrees = (angle:number) => mod(angle * DEGREES, 360)
export const radians = (angle:number) => mod(angle, 360) * RADIANS
export const elem_mul = ([a,b,c]:XYZ,[x,y,z]:XYZ): XYZ => [a*x, b*y, c*z]
export const is_hex_code = (s:string) => /^#?[0-9a-fA-F]{6}$/.test(s)
export const gamma = (x:number) => 
    (x <= 0) ? 0 :
    (x > 0.0031308) ? (1.055 * Math.pow(x, 0.4166666666666667) - 0.055) 
                    : 12.92 * x
export const gamma_inverse = (x:number) => 
    (x > 0.04045) ? Math.pow((x + 0.055) * 0.9478672985781991, 2.4)
                  : 0.07739938080495357 * x

export const M16 = ([X, Y, Z]: XYZ): sRGB => [
    + 0.401288 * X + 0.650173 * Y - 0.051461 * Z,
    - 0.250268 * X + 1.204414 * Y + 0.045854 * Z,
    - 0.002079 * X + 0.048952 * Y + 0.953127 * Z]

export const M16_inv = ([R, G, B]: sRGB): XYZ => [
    + 1.862067855087233e+0 * R - 1.011254630531685e+0 * G + 1.491867754444518e-1 * B,
    + 3.875265432361372e-1 * R + 6.214474419314753e-1 * G - 8.973985167612518e-3 * B,
    - 1.584149884933386e-2 * R - 3.412293802851557e-2 * G + 1.049964436877850e+0 * B]


// Parameters to the CAM16 model
export const params = ({
    whitepoint: standard_whitepoints.D65, //D65,
    adapting_luminance: 50,    // L_A (default 40) 
    background_luminance: 75,  // Y_b; relative to Y_w = 100 (default 20)
    surround: 2,       // 0='dark', 1='dim', 2='average', or a number from 0 to 2
    discounting: false
})

// Caluclate a bunch of constants based on the CAM16 parameters
export const XYZ_w = params.whitepoint
export const L_A = params.adapting_luminance
export const Y_b = params.background_luminance
export const Y_w = XYZ_w[1] // White point luminance
export const c = params.surround >= 1
    ? lerp(0.59, 0.69, params.surround - 1)
    : lerp(0.525, 0.59, params.surround)
export const F = c >= 0.59
    ? lerp(0.9, 1.0, (c - 0.59) / .1)
    : lerp(0.8, 0.9, (c - 0.525) / 0.065)
export const N_c = F
export const k = 1 / (5 * L_A + 1)
export const k4 = k * k * k * k;
export const F_L = (k4 * L_A + 0.1 * (1 - k4) * (1 - k4) * Math.pow(5 * L_A, 1 / 3))  // Luminance adaptation factor
export const F_L_4 = Math.pow(F_L, 0.25)
export const n = Y_b / Y_w
export const z = 1.48 + Math.sqrt(n) // Lightness non-linearity exponent (modified by `c`)
export const N_bb = 0.725 * Math.pow(n, -0.2) // Chromatic induction factors
export const N_cb = N_bb
export const D = !params.discounting
    ? clip(0, 1, F * (1 - 1 / 3.6 * Math.exp((-L_A - 42) / 92)))
    : 1
const exponent = 1 / 0.42
const constant = 100 / F_L * Math.pow(27.13, exponent);
export const adapt = (component:number) => {
    const x = Math.pow(F_L * Math.abs(component) * 0.01, 0.42);
    return sgn(component) * 400 * x / (x + 27.13);
}

export const unadapt = (component:number) => {
    const cabs = Math.abs(component);
    return sgn(component) * constant * Math.pow(cabs / (400 - cabs), exponent);
}
export const RGB_w = M16(XYZ_w) // Cone responses of the white point
export const D_RGB = <sRGB>RGB_w.map(C_w => lerp(1, Y_w / C_w, D))
export const D_RGB_inv = <sRGB>D_RGB.map(D_C => 1 / D_C)
export const RGB_cw = <sRGB>[RGB_w[0] * D_RGB[0], RGB_w[1] * D_RGB[1], RGB_w[2] * D_RGB[2]]
export const RGB_aw = RGB_cw.map(adapt)
export const A_w = N_bb * (2 * RGB_aw[0] + RGB_aw[1] + 0.05 * RGB_aw[2])

/**
 * Convert from cam16 hue space to uniform space hue by piecemeal non linear transform
 * @param  {number} hin - CAM16 hue has a range [0..360] where 20.14=Red, 90=Yellow, 164.25=Green, 237.53=Blue, 380.14=Red. 
 * @returns number - Uniform space hue has a range [0..360] where 0=Red, 90=Yellow, 180=Green, 270=Blue, 360=Red. (note 360 range rather than 400 range of paper)
 */
export function h_to_Hu(hin:number): number {
    const hinn = (hin + 360) % 360
    const h = (hinn<20.14) ? hinn+360 : hinn
    const i = (h<90) ? 0 : (h<164.25) ? 1 : (h<237.53) ? 2 : 3
    const di = iheH[i]
    const di1 = iheH[i+1]
    const Hu = di.H + (100*di1.e*(h - di.h)) / (di1.e*(h - di.h) + di.e*(di1.h - h))
    return ((Hu + 400) % 400)/400*360
}

/**
 * Convert from uniform space hue to cam16 hue space by piecemeal non linear transform
 * @param  {number} Hu - Uniform space hue has a range [0..360] where 0=Red, 90=Yellow, 180=Green, 270=Blue, 360=Red. (note 360 range rather than 400 range of paper)
 * @returns number - CAM16 hue has a range [0..360] where 20.14=Red, 90=Yellow, 164.25=Green, 237.53=Blue, 380.14=Red. 
 */
export function Hu_to_h(Hu:number): number {
    const H = ((Hu + 360) % 360)/360*400
    const i = (H<100) ? 0 : (H<200) ? 1 : (H<300) ? 2 : 3
    const di = iheH[i]
    const di1 = iheH[i+1]
    const h = ((H - di.H)*(di1.e*di.h - di.e*di1.h) - 100*di.h*di1.e) / ((H - di.H)*(di1.e - di.e) - 100*di1.e)
    return (h + 360) % 360
}

 /**
 * Convert from uniform space hue to hue label [A-Za-z]
 * @param  {number} Hu - Uniform space hue has a range [0..360] where 0=Red, 90=Yellow, 180=Green, 270=Blue, 360=Red. (note 360 range rather than 400 range of paper)
 * @returns string - hue label as a single character string. warm colors capitals (A=purple, I=red, Y=yellow), cool colors lower (a=lemon, g=green, n=cyan, y=blue)
 */
export function Hu_to_label(Hu:number): string {
    const alpha = ((Hu + 60) % 180) / 180 * 26
    const lower = ((Hu + 60) % 360) >= 180 ? 32 : 0
    return String.fromCharCode(65+alpha+lower)
}

/**
 * Convert from uniform space to hex label [A-Za-z]
 * @param  {number} Hu - Uniform space hue has a range [0..360] where 0=Red, 90=Yellow, 180=Green, 270=Blue, 360=Red. (note 360 range rather than 400 range of paper)
 * @returns string - hue label as a single character string. warm colors capitals (D=magenta, J=red, Y=yellow), cool colors lower (a=lemon, f=green, n=cyan, y=blue)
 */
export function JuMuHu_to_label(c:JuMuHu, precise=false): string {
    const divisor = precise ? 1 : 10
    return Math.floor(c.Ju/divisor)+this.Hu_to_label(c.Hu)+Math.floor(c.Mu*2/divisor)
}


/**
 * Convert from uniform cam16 space to a and b components, useful for DeltaE calcs
 * @param  {obj} x - Object with CAM16UCS components { Mu: colorfulness, Hu: hue angle [0-360] } 
 * @returns {obj} - Object with components { a: magenta-teal, b: yellow-blue }
 */
export function MuHu_to_ab({ Mu, Hu }: JuMuHu|CAM16u): { a:number, b: number} {
    const hu_rad = radians(Hu)
    return {
        a: Mu * Math.cos(hu_rad),
        b: Mu * Math.sin(hu_rad),
    }
}
