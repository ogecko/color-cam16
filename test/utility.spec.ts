import { describe, expect, test } from '@jest/globals'
import { fp, c360, lerp, h_to_Hu, Hu_to_h } from '../src/index'

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
        hHu_test_data.forEach(d => {
            expect(h_to_Hu(d.h).toFixed(1)).toEqual(d.Hu.toFixed(1))
        })
    });

    test('Hu_to_h converts from uniform hue space to hue correctly', () => {
        hHu_test_data.forEach(d => {
            expect(Hu_to_h(d.Hu).toFixed(1)).toEqual(d.h.toFixed(1))
        })
    });



})
