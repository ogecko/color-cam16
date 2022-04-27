import { describe, expect, test } from '@jest/globals'
import { parse_color_theme } from '../src/index'

describe('Color Language Parser Functions', () => {

    test('should be defined', () => {
        expect(true).toBeDefined();
    });

    test('should parse +/- Numbers into js number', () => {
        const definitions = [
            { text: 'testcase 10', result: 10 },
            { text: 'testcase 1.3', result: 1.3 },
            { text: 'testcase +0.1', result: 0.1 },
            { text: 'testcase 0', result: 0 },
            { text: 'testcase -100', result: -100 },
            { text: 'testcase -1.3', result: -1.3 },
        ]
        definitions.forEach(({ text, result }) => {
            expect(parse_color_theme(text)).toEqual(result);

        })
    });

    test('should parse a Colors into js Objects with cam16 ucs components and hex', () => {
        const definitions = [
            { text: 'testcase #ff0000', result: { hexLabel2: "52J101" } },
            { text: 'testcase hmj(0,40,50)', result: { hexLabel2: "50I80" } },
            { text: 'testcase hmj(0,100,50)', result: { hexLabel2: "50I97" } },
            { text: 'testcase hmj(270,20,50) darker by 21', result: { hexLabel2: "29v40" } },
        ]
        definitions.forEach(({ text, result }) => {
            expect(parse_color_theme(text)).toMatchObject(result);

        })
    });

    // test('should parse color assignments and use of identifiers', () => {
    //     const definitions = [
    //         { text: 'primary is hmj(10,10,50). secondary is hmj(180,20,40). primary lighter by 8', result: [{ Ju: 58 }] },
    //         { text: 'primary is hmj(10,10,50). secondary is hmj(180,20,40). primary to secondary in 3 steps', result: [{ Ju: 50 },{ Ju: 45 },{ Ju: 40 }] },
    //     ]
    //     definitions.forEach(({ text, result }) => {
    //         expect(parse_color_theme(text)).toMatchObject(result);

    //     })
    // });

    // test('should parse a color theme into an array of colors', () => {
    //     const definitions = [
    //         // { text: '#800000 lighter by 30 in 3 steps', result: '#ff8000' },
    //         // { text: '#ff8000, warmer, in 5 steps. #cdeee1, darker by 10, in 5 steps. ', result: '#jjj' },
    //         // { text: '#ff8000', result: '#ff8000' },
    //         // { text: 'primary is darker', result: {Ju: -5, Mu:0, Hu:0} },
    //         // { text: 'primary is darker by 7', result: 10 },
    //         // { text: 'primary is v-model. primary swatches, stronger from 0 to 100 in 5 steps , darker from 100 to 0 in 5 steps.', result: 20 },
    //         // { text: 'text is primary, contrasting by 100', result: 30 }, 
    //         // { text: 'gradient is from red  to 1st triadic, in 6 steps', result: 30 }, 
    //         // { text: 'gradient 2 is from blue to 1st triadic, in 6 steps', result: 30 }, 
    //     ]
    //     definitions.forEach(({ text, result }) => {
    //         expect(parse_color_theme(text).map(c => c.hex)).toEqual(result);
    //     })
    // });


})