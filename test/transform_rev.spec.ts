import { describe, expect, test } from '@jest/globals'
import { hexsrgb_testdata } from './transform_testdata'
import { marsBrownHex, marsBrownRGB, marsBrownXYZ, marsBrownCam16, marsBrownJuMuHu } from './transform_testdata'
import { srgb_to_hex, srgb_to_xyz, hex_to_JMhQCs, hex_to_JuMuHu } from '../src/index'


describe('Reverse Color Transform Functions', () => {

    test('should be defined', () => {
        expect(true).toBeDefined();
    });

    test('hex_to_srgb to convert to sRGB', () => {
        hexsrgb_testdata.forEach(d => expect(srgb_to_hex(d.srgb)).toStrictEqual(d.hex))
    });

    test('srgb_to_hex converts #ad6242 Mars Brown correctly', () => {
        expect(srgb_to_hex(marsBrownRGB)).toEqual(marsBrownHex);
    });

    test('srgb_to_hex converts #ff8001  correctly', () => {
        expect(srgb_to_hex([1, 0.5, 0.01])).toEqual('#ff8003');
    });

    test('srgb_to_hex to return "" for out of range RGB', () => {
        expect(srgb_to_hex([100, 0.5, 0.01])).toEqual("");
    });

    test('srgb_to_xyz converts #ad6242 Mars Brown correctly', () => {
        expect(srgb_to_xyz(marsBrownRGB)).toEqual(marsBrownXYZ);
    });

    test('hex_to_JMhQCs converts #ad6242 Mars Brown correctly', () => {
        expect(hex_to_JMhQCs(marsBrownHex)).toEqual(marsBrownCam16);
    });

    test('hex_to_JuMuHu converts #ad6242 Mars Brown correctly', () => {
        expect(hex_to_JuMuHu(marsBrownHex)).toEqual(marsBrownJuMuHu);
    });

})