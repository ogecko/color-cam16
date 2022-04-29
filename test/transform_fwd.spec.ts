import { describe, expect, test } from '@jest/globals'
import { hexsrgb_testdata, rgb_extremeties } from './transform_testdata'
import { marsBrownHex, marsBrownRGB, marsBrownXYZ, marsBrownCam16, marsBrownJuMuHu } from './transform_testdata'
import { hex_to_srgb, srgb_to_xyz, hex_to_JMhQCs, hex_to_JuMuHu } from '../src/index'
import { xyz_to_JMhQCs, xyz_to_JuMuHu, JuMuHu_to_hex } from '../src/index'

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

    test('xyz_to_JMhQCs converts #ad6242 Mars Brown correctly', () => {
        expect(xyz_to_JMhQCs(marsBrownXYZ)).toEqual(marsBrownCam16);
    });


    test('xyz_to_JuMuHu converts #ad6242 Mars Brown correctly', () => {
        expect(xyz_to_JuMuHu(marsBrownXYZ)).toEqual(marsBrownJuMuHu);
    });

    test('hex_to_JMhQCs converts #ad6242 Mars Brown correctly', () => {
        expect(hex_to_JMhQCs(marsBrownHex)).toEqual(marsBrownCam16);
    });

    test('hex_to_JuMuHu converts #ad6242 Mars Brown correctly', () => {
        expect(hex_to_JuMuHu(marsBrownHex)).toEqual(marsBrownJuMuHu);
    });

    test('round trip conversion of extremeties of sRGB space', () => {
        rgb_extremeties.forEach(hex1 => {
            const ucs = hex_to_JuMuHu(hex1)
            const hex2 = JuMuHu_to_hex(ucs)
            expect(hex2).toEqual(hex1);  
        })
    });








})
