import { XYZ } from "./types"

// Definition of Constants
export const XYZ_outOfGamut = [950, 950, 950] as XYZ
export const XYZ_blackpoint = [ 0, 0, 0 ] as XYZ
export const JMH_whitepoint = { J: 99.99955537650459, M: 1.9077118865272156, h: 209.49854407518322 }
export const DEGREES = 180 / Math.PI
export const RADIANS = Math.PI / 180
export const EPSILONRGB = 0.0002
export const EPSILONXYZ = 0.5

export const standard_whitepoints = {
    A: [109.850, 100, 35.585] as XYZ,       // typical, domestic, tungsten-filament lighting
    B: [99.090, 100, 85.324] as XYZ,        // representative of noon sunlight
    C: [98.074, 100, 118.232] as XYZ,       // represented average day light (poor representation)
    E: [100, 100, 100] as XYZ,              // equal-energy illuminant
    D50: [96.422, 100, 82.521] as XYZ,      // horizon light, ICC profile PCS
    D55: [95.682, 100, 92.149] as XYZ,      // mid-morning / mid-afternoon daylight
    D65: [95.047, 100, 108.883] as XYZ,     // noon daylight: television, sRGB color space
    D75: [94.972, 100, 122.638] as XYZ,     // North sky daylight
    F2: [99.186, 100, 67.393] as XYZ,       // "standard" fluorescent lamps
    F7: [95.041, 100, 108.747] as XYZ,      // "broadband" (full-spectrum light) fluorescent lamps
    F11: [100.962, 100, 64.350] as XYZ,     // narrow triband illuminants consisting of three "narrowband" emissions
}

// CAM16 UCS Hue quadrature calculation data
export const iheH = [
    { i: 1, h:  20.14, e: 0.8, H:  0 },          // Red
    { i: 2, h:  90.00, e: 0.7, H: 100 },         // Yellow
    { i: 3, h: 164.25, e: 1.0, H: 200 },         // Green
    { i: 4, h: 237.53, e: 1.2, H: 300 },         // Blue
    { i: 5, h: 380.14, e: 0.8, H: 400 },         // Red
]

