import { sRGB, XYZ } from '../src/types'
import {describe, expect, test} from '@jest/globals'
import { hex_to_srgb, srgb_to_xyz, hex_to_cam16, hex_to_cam16_ucs } from '../src/index'
import { xyz_to_cam16, xyz_to_cam16_ucs } from '../src/index'

// cam16 test data
const marsBrownHex = '#ad6242'
const marsBrownRGB:sRGB = [0.6784313725490196, 0.3843137254901961, 0.25882352941176473]
const marsBrownXYZ:XYZ = [22.583696650753893, 18.014172167112505, 7.4413134055600425]
const outOfGamutXYZ:XYZ = [950, 950, 950]
const marsBrownJMh = { J: 33.09061369383953, M: 32.11195665587679, h: 40.65100400168725 }
const marsBrownJuMuHu = { Ju: 45.67430727510713, Mu: 24.094952600019898, Hu: 24.00199977545411 }
const marsBrownCam16 = { ...marsBrownJMh, C: 36.04445246752391, Q: 93.8591243975215, s: 58.49182005670378 }
const marsBrownCam16ucs = { ...marsBrownCam16, ...marsBrownJuMuHu }
const rgb_extremeties = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff','#ffffff', 
    '#ffbb22', '#fdff00', '#11cc55', '#00ffee', '#04d9ff'
]
// 95% of sRGB color space should have DeltaE round trip conversion of < 1.1, worst is 2.5   
const deltaE_data = [
    { ucs1: marsBrownJuMuHu,          dE: 0.2 },
    { ucs1: { Ju: 30, Mu:5,  Hu:15},  dE: 2.6 },     // worst case
    { ucs1: { Ju: 35, Mu:22, Hu:95},  dE: 1.1 },
    { ucs1: { Ju: 15, Mu:0,  Hu:240}, dE: 1.1 }
]
// key points of mapping equivalence between hue and uniform hue space
const hHu_test_data = [
    { Hu: 0, h: 20.14}, 
    { Hu: 90, h: 90}, 
    { Hu: 180, h: 164.25}, 
    { Hu: 270, h: 237.52}, 
    { Hu: 359, h: 19.08}, 
    { Hu: 20, h: 37.34}, 
    { Hu: 170, h: 153}, 
    { Hu: 190, h: 171.16}, 
    { Hu: 260, h: 227.97}, 
    { Hu: 300, h: 298.65}, 
]
//  helper functions
const approxArr = (arr: number[]) => arr.map((x: number): string => x.toFixed(12))



describe('Color Transform Functions', () => {
    test('hex_to_srgb to throw an error when input is invalid', () => {
        expect(()=>hex_to_srgb('#GG2010')).toThrow('Bad Input')
    });

    test('hex_to_srgb to convert to sRGB', () => {
        const testdata = [ 
            { testcase: '000000', expectedresult: [0,0,0] },
            { testcase: '203040', expectedresult: [0.12549019607843137, 0.18823529411764706, 0.25098039215686274] },
            { testcase: '#90A0B0', expectedresult: [0.5647058823529412, 0.6274509803921569, 0.6901960784313725] },
            { testcase: '#ff80ff', expectedresult: [1, 0.5019607843137255, 1] },
            { testcase: marsBrownHex, expectedresult: marsBrownRGB },
        ]
        testdata.forEach(d => expect(hex_to_srgb(d.testcase)).toStrictEqual(d.expectedresult))
    });

    test('srgb_to_xyz converts #ad6242 Mars Brown correctly', () => {
        expect(srgb_to_xyz(marsBrownRGB)).toEqual(marsBrownXYZ);
    });

    test('xyz_to_cam16 converts #ad6242 Mars Brown correctly', () => {
        expect(xyz_to_cam16(marsBrownXYZ)).toEqual(marsBrownCam16);
    });

    test('xyz_to_cam16_ucs converts #ad6242 Mars Brown correctly', () => {
        expect(xyz_to_cam16_ucs(marsBrownXYZ)).toEqual(marsBrownCam16ucs);
    });

    test('hex_to_cam16 converts #ad6242 Mars Brown correctly', () => {
        expect(hex_to_cam16(marsBrownHex)).toEqual(marsBrownCam16);
    });

    test('hex_to_cam16_ucs converts #ad6242 Mars Brown correctly', () => {
        expect(hex_to_cam16_ucs(marsBrownHex)).toEqual(marsBrownCam16ucs);
    });









})
