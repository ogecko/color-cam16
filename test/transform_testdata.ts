import { sRGB, XYZ } from '../src/types'

// cam16 test data
export const marsBrownHex = '#ad6242'
export const marsBrownRGB: sRGB = [0.6784313725490196, 0.3843137254901961, 0.25882352941176473]
export const marsBrownXYZ: XYZ = [22.583696650753893, 18.014172167112505, 7.4413134055600425]
export const outOfGamutXYZ: XYZ = [950, 950, 950]
export const marsBrownJMh = { J: 33.09061369383953, M: 32.11195665587679, h: 40.65100400168725 }
export const marsBrownJuMuHu = { Ju: 45.67430727510713, Mu: 24.094952600019898, Hu: 24.00199977545411 }
export const marsBrownCam16 = { ...marsBrownJMh, C: 36.04445246752391, Q: 93.8591243975215, s: 58.49182005670378 }
export const marsBrownCam16ucs = { ...marsBrownCam16, ...marsBrownJuMuHu }
export const rgb_extremeties = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff',
    '#ffbb22', '#fdff00', '#11cc55', '#00ffee', '#04d9ff'
]

export const hexsrgb_testdata = [
    { hex: '#000000', srgb: <sRGB>[0, 0, 0] },
    { hex: '#203040', srgb: <sRGB>[0.12549019607843137, 0.18823529411764706, 0.25098039215686274] },
    { hex: '#90a0b0', srgb: <sRGB>[0.5647058823529412, 0.6274509803921569, 0.6901960784313725] },
    { hex: '#ff80ff', srgb: <sRGB>[1, 0.5019607843137255, 1] },
    { hex: marsBrownHex, srgb: marsBrownRGB },
]

// 95% of sRGB color space should have DeltaE round trip conversion of < 1.2, worst is 2.5   
export const deltaE_testdata = [
    { ucs1: marsBrownJuMuHu, dE: 0.2 },
    { ucs1: { Ju: 30, Mu: 5, Hu: 15 }, dE: 2.6 },     // worst case
    { ucs1: { Ju: 35, Mu: 22, Hu: 95 }, dE: 1.2 },
    { ucs1: { Ju: 15, Mu: 0, Hu: 240 }, dE: 1.2 }
]

// key points of mapping equivalence between hue and uniform hue space
export const hHu_testdata = [
    { Hu: 0, h: 20.14 },
    { Hu: 90, h: 90 },
    { Hu: 180, h: 164.25 },
    { Hu: 270, h: 237.52 },
    { Hu: 359, h: 19.08 },
    { Hu: 20, h: 37.34 },
    { Hu: 170, h: 153 },
    { Hu: 190, h: 171.16 },
    { Hu: 260, h: 227.97 },
    { Hu: 300, h: 298.65 },
]

export const HuLabel_testdata = [
    { Hu: 0, label: 'I' },
    { Hu: 90, label: 'V' },
    { Hu: 180, label: 'i' },
    { Hu: 270, label: 'v' },
    { Hu: 360, label: 'I' },
    { Hu: 305, label: 'A' },
    { Hu: 118, label: 'Z' },
    { Hu: 125, label: 'a' },
    { Hu: 298, label: 'z' },
]
