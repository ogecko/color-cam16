import { describe, expect, test } from '@jest/globals'
import { hHu_testdata, HuLabel_testdata } from './transform_testdata'
import { fp, c360, lerp, h_to_Hu, Hu_to_h, Hu_to_label } from '../src/index'

describe('Utility Functions', () => {
    test('fp should convert floating point to string with 2 decimals', () => {
        expect(fp(30)).toBe('30.00')
    });

    test('c360 should clamp a floating point to 0..360', () => {
        const testdata = [ 
            { testcase:10, expectedresult: 10 },
            { testcase:-20, expectedresult: 340 },
            { testcase: 375, expectedresult: 15 },
        ]
        testdata.forEach(d => expect(c360(d.testcase)).toBe(d.expectedresult))
    });

    test('lerp should perform linear interpolation', () => {
        const testdata:Array<{args:[number,number,number], expectedresult:number }> = [ 
            { args: [0, 10, 0.5], expectedresult: 5 },
            { args: [0, 20, 0.2], expectedresult: 4 },
            { args: [10, 20, 0.2], expectedresult: 12 },
        ]
        testdata.forEach(d => expect(lerp(... d.args)).toBe(d.expectedresult))
    });

    test('h_to_Hu converts from hue to uniform hue space correctly', () => {
        hHu_testdata.forEach(d => {
            expect(h_to_Hu(d.h).toFixed(1)).toEqual(d.Hu.toFixed(1))
        })
    });

    test('Hu_to_h converts from uniform hue space to hue correctly', () => {
        hHu_testdata.forEach(d => {
            expect(Hu_to_h(d.Hu).toFixed(1)).toEqual(d.h.toFixed(1))
        })
    });

    test('Hu_to_label converts from uniform hue space to hue correctly', () => {
        HuLabel_testdata.forEach(d => {
            expect(Hu_to_label(d.Hu)).toEqual(d.label)
        })
    });


})
