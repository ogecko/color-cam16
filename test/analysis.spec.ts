import { describe, expect, test } from '@jest/globals'
import { deltaE_testdata } from './transform_testdata'
import { JuMuHu_to_hex, hex_to_JuMuHu, delta_e, shortest_signed_distance } from '../src/index'
import { find_strongest_Mu, find_strongest_Ju, find_strongest_color } from '../src/index'
import { JuMuHu_to_color, adjust_colors } from '../src/index'

describe('Color Analysis Functions', () => {

    test('should be defined', () => {
        expect(true).toBeDefined();
    });


    test('delta_e measures small difference in round trip ucs to hex to ucs conversion', () => {
        deltaE_testdata.forEach( ({ ucs1, dE }) => {
            const hex = JuMuHu_to_hex(ucs1)
            const ucs2 = hex_to_JuMuHu(hex)
            const deltaE2 = delta_e(ucs1, ucs2)
            expect(deltaE2).toBeLessThan(dE)
        })
    });

    test('delta_e measures a small difference between two adjacent reds with large hue difference', () => {
        const ucs1 = { Ju: 65, Mu: 42, Hu: 1 } // warmer red
        const ucs2 = { Ju: 65, Mu: 42, Hu: 358 } // cooler red
        const deltaE2 = delta_e(ucs1, ucs2)
        expect(deltaE2).toBeLessThan(3)
    });

    test('delta_e measures a large difference across the color wheel', () => {
        const ucs1 = { Ju: 30, Mu: 40, Hu: 291 } // deep blue
        const ucs2 = { Ju: 90, Mu: 36, Hu: 111 } // bright yellow
        const deltaE2 = delta_e(ucs1, ucs2)
        expect(deltaE2).toBeGreaterThan(25)
    });

    test('delta_e measures a large difference between black and white', () => {
        const ucs1 = { Ju: 0, Mu: 0, Hu: 0 } // deep blue
        const ucs2 = { Ju: 100, Mu: 0, Hu: 180 } // bright yellow
        const deltaE2 = delta_e(ucs1, ucs2)
        expect(deltaE2).toBeGreaterThan(25)
    });

    test('find_strongest_Mu to return highest Mu a range of colors', () => {
        const search_largest_Mu_data = [
            { ucs: { Ju: 65, Mu: 10, Hu: 290},  Mu: 31.119 },
            { ucs: { Ju: 85, Mu: 10, Hu: 156},  Mu: 46.9082 },
            { ucs: { Ju: 15, Mu: 10, Hu: 313},  Mu: 29.1914 },
            { ucs: { Ju: 100, Mu: 10, Hu: 156}, Mu: 1.8359 },
            { ucs: { Ju: 0, Mu: 10, Hu: 156},   Mu: 0.4589 },
            { ucs: { Ju: 50, Mu: 10, Hu: 0},   Mu: 46.9082 },
        ]
        search_largest_Mu_data.forEach( ({ ucs, Mu }) => {
            expect(find_strongest_Mu(ucs)).toBeCloseTo(Mu)
        })
    });

    test('find_strongest_Mu doesnt iterrate past 13', () => {
        const ucs = { Ju: 85, Mu: 10, Hu: 156}
        expect(find_strongest_Mu(ucs, 0, 10000)).toEqual(0)
    });

    test('find_strongest_Ju to return ideal Ju for the highest chromatic color at a given Hu', () => {
        const search_strongest_Ju_data = [
            { Hu: 0,  Ju: 50 },
            { Hu: 56,  Ju: 70 },
            { Hu: 112,  Ju: 90 },
            { Hu: 155,  Ju: 80 },
            { Hu: 232,  Ju: 80 },
            { Hu: 292,  Ju: 30 },
            { Hu: 307,  Ju: 50 },
        ]
        search_strongest_Ju_data.forEach( ({ Hu, Ju }) => {
            expect(find_strongest_Ju(Hu)).toBeCloseTo(Ju)
        })
    });

    test('find_strongest_color to return ucs for the highest chromatic color at a given Hu', () => {
        const search_strongest_ucs_data = [
            { Hu: 0,  hex: '#f01a38' },
            { Hu: 56,  hex: '#f89701' },
            { Hu: 112,  hex: '#fde702' },
            { Hu: 155,  hex: '#65ed16' },
            { Hu: 232,  hex: '#01e4f0' },
            { Hu: 292,  hex: '#2116ff' },
            { Hu: 307,  hex: '#a64afe' },
        ]
        search_strongest_ucs_data.forEach( ({ Hu, hex }) => {
            expect(find_strongest_color(Hu).hex).toEqual(hex)
        })
    });

    test('shortest_signed_distance between two angles', () => {
        const signed_distance_data = [
            { a: 20, b: 40, result: 20 },
            { a: 60, b: 50, result: -10 },
            { a: 0, b: 179, result: 179 },
            { a: 0, b: 180, result: 180 },
            { a: 0, b: 181, result: -179 },
            { a: 0, b: 345, result: -15 },
            { a: 30, b: 207, result: 177 },
            { a: 30, b: 210, result: 180 },
            { a: 30, b: 213, result: -177 },
            { a: 30, b: 270, result: -120 },
            { a: 350, b: 20, result: 30 },
            { a: 350, b: 25, result: 35 },
            { a: 350, b: 30, result: 40 },
            { a: -20, b: 30, result: 50 },
            { a: 30, b: -30, result: -60 },
            { a: -20, b: 335, result: -5 },
        ]
        signed_distance_data.forEach( ({ a, b, result }) => {
            expect(shortest_signed_distance(a,b)).toEqual(result)
        })
    });

    test('adjust_colors a color based on linear transform of components ', () => {
        const signed_distance_data = [
            { adj: { Jub: 20 }, color: { Hu: 30, Mu: 15, Ju: 35 }, result: [{ Ju: 55 }] },
            { adj: { Jua: 0, Jub: 20 }, color: { Hu: 30, Mu: 15, Ju: 35 }, result: [{ Ju: 20 }] },
            { adj: { Jub: -30, steps: 4 }, color: { Hu: 30, Mu: 15, Ju: 70 }, result: [{ Ju: 70 }, { Ju: 60 }, { Ju: 50 }, { Ju: 40 }] },
            { adj: { Hua: 0, Hub: 350, steps: 3 }, color: { Hu: 30, Mu: 15, Ju: 70 }, result: [{ Hu: 30 }, { Hu: 10 }, { Hu: -10 }] },
        ]
        signed_distance_data.forEach( ({ adj, color, result }) => {
            expect(adjust_colors(adj, JuMuHu_to_color(color))).toMatchObject(result)
        })
    });



})