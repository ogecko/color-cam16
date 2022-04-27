import { describe, expect, test } from '@jest/globals'
import { hexsrgb_testdata, rgb_extremeties } from './transform_testdata'
import { marsBrownHex, marsBrownRGB, marsBrownXYZ, marsBrownCam16, marsBrownCam16ucs } from './transform_testdata'
import { hex_to_srgb, srgb_to_xyz, hex_to_cam16, hex_to_cam16_ucs } from '../src/index'
import { xyz_to_cam16, xyz_to_cam16_ucs, cam16_ucs_to_hex } from '../src/index'

//  helper functions
const approxArr = (arr: number[]) => arr.map((x: number): string => x.toFixed(12))

describe('Forward Color Transform Functions', () => {
    test('hex_to_srgb to throw an error when input is invalid', () => {
        expect(()=>hex_to_srgb('#GG2010')).toThrow('Bad Input')
    });

    test('hex_to_srgb to convert to sRGB', () => {
        hexsrgb_testdata.forEach(d => expect(hex_to_srgb(d.hex)).toStrictEqual(d.srgb))
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

    test('round trip conversion of extremeties of sRGB space', () => {
        rgb_extremeties.forEach(hex1 => {
            const ucs = hex_to_cam16_ucs(hex1)
            const hex2 = cam16_ucs_to_hex(ucs)
            expect(hex2).toEqual(hex1);  
        })
    });








})
