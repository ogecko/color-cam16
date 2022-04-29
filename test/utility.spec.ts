import { describe, expect, test } from '@jest/globals'
import { hHu_testdata, HuLabel_testdata } from './transform_testdata'
import { fp, c360, lerp, is_hex_code, is_ucs_label3, is_ucs_label5 } from '../src/index'
import { h_to_Hu, Hu_to_h, Hu_to_label, label_to_Hu } from '../src/index'

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

    test('is_hex_code should test syntax correctly', () => {
        const testdata:Array<{ s:string, expectedresult:boolean }> = [ 
            { s: '#FFFFFF', expectedresult: true },
            { s: '#aaffdd', expectedresult: true },
            { s: '202020', expectedresult: true },
            { s: '#GFFFFF', expectedresult: false },
            { s: '#fff', expectedresult: false },
        ]
        testdata.forEach(d => expect(d.s+' '+is_hex_code(d.s)).toBe(d.s+' '+d.expectedresult))
    });

    test('is_ucs_label3 should test syntax correctly', () => {
        const testdata:Array<{ s:string, expectedresult:boolean }> = [ 
            { s: '8a3', expectedresult: true },
            { s: '3F3', expectedresult: true },
            { s: '99b22', expectedresult: false },
            { s: '#8a3', expectedresult: false },
            { s: '#GFFFFF', expectedresult: false },
            { s: '#fff', expectedresult: false },
        ]
        testdata.forEach(d => expect(d.s+' '+is_ucs_label3(d.s)).toBe(d.s+' '+d.expectedresult))
    });

    test('is_ucs_label5 should test syntax correctly', () => {
        const testdata:Array<{ s:string, expectedresult:boolean }> = [ 
            { s: '8a3', expectedresult: false },
            { s: '3F3', expectedresult: false },
            { s: '99b22', expectedresult: true },
            { s: '99b100', expectedresult: false },
            { s: '#8a3', expectedresult: false },
            { s: '#GFFFFF', expectedresult: false },
            { s: '#fff', expectedresult: false },
        ]
        testdata.forEach(d => expect(d.s+' '+is_ucs_label5(d.s)).toBe(d.s+' '+d.expectedresult))
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

    test('label_to_Hu converts from letter to uniform hue space correctly', () => {
        HuLabel_testdata.forEach(d => {
            expect(Math.round(label_to_Hu(d.label))).toEqual(d.Hu)
        })
    });

})
