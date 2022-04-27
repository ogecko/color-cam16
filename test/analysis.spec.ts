import { describe, expect, test } from '@jest/globals'
import { deltaE_testdata } from './transform_testdata'
import { cam16_ucs_to_hex, hex_to_cam16_ucs, deltaE_ucs, shortest_signed_distance } from '../src/index'
import { find_largest_Mu, find_strongest_Ju, find_strongest_ucs } from '../src/index'
import { cam16_ucs_to_hex_ingamut, cam16_ucs_adjust } from '../src/index'

describe('Color Analysis Functions', () => {

    test('should be defined', () => {
        expect(true).toBeDefined();
    });


    test('deltaE_ucs measures small difference in round trip ucs to hex to ucs conversion', () => {
        deltaE_testdata.forEach( ({ ucs1, dE }) => {
            const hex = cam16_ucs_to_hex(ucs1)
            const ucs2 = hex_to_cam16_ucs(hex)
            const deltaE2 = deltaE_ucs(ucs1, ucs2)
            expect(deltaE2).toBeLessThan(dE)
        })
    });

    test('deltaE_ucs measures a small difference between two adjacent reds with large hue difference', () => {
        const ucs1 = { Ju: 65, Mu: 42, Hu: 1 } // warmer red
        const ucs2 = { Ju: 65, Mu: 42, Hu: 358 } // cooler red
        const deltaE2 = deltaE_ucs(ucs1, ucs2)
        expect(deltaE2).toBeLessThan(3)
    });

    test('deltaE_ucs measures a large difference across the color wheel', () => {
        const ucs1 = { Ju: 30, Mu: 40, Hu: 291 } // deep blue
        const ucs2 = { Ju: 90, Mu: 36, Hu: 111 } // bright yellow
        const deltaE2 = deltaE_ucs(ucs1, ucs2)
        expect(deltaE2).toBeGreaterThan(25)
    });

    test('deltaE_ucs measures a large difference between black and white', () => {
        const ucs1 = { Ju: 0, Mu: 0, Hu: 0 } // deep blue
        const ucs2 = { Ju: 100, Mu: 0, Hu: 180 } // bright yellow
        const deltaE2 = deltaE_ucs(ucs1, ucs2)
        expect(deltaE2).toBeGreaterThan(25)
    });

    test('find_largest_Mu to return highest Mu a range of colors', () => {
        const search_largest_Mu_data = [
            { ucs: { Ju: 65, Mu: 10, Hu: 290},  Mu: 31.152 },
            { ucs: { Ju: 85, Mu: 10, Hu: 156},  Mu: 49.511 },
            { ucs: { Ju: 15, Mu: 10, Hu: 313},  Mu: 29.199 },
            { ucs: { Ju: 100, Mu: 10, Hu: 156}, Mu: 1.855 },
            { ucs: { Ju: 0, Mu: 10, Hu: 156},   Mu: 0.488 },
        ]
        search_largest_Mu_data.forEach( ({ ucs, Mu }) => {
            expect(find_largest_Mu(ucs)).toBeCloseTo(Mu)
        })
    });

    test('find_largest_Mu doesnt iterrate past 13', () => {
        const ucs = { Ju: 85, Mu: 10, Hu: 156}
        expect(find_largest_Mu(ucs, 0, 10000)).toEqual(0)
    });

    test('find_strongest_Ju to return ideal Ju for the highest chromatic color at a given Hu', () => {
        const search_strongest_Ju_data = [
            { Hu: 0,  Ju: 59.6 },
            { Hu: 56,  Ju: 76.2 },
            { Hu: 112,  Ju: 91.7 },
            { Hu: 155,  Ju: 85.1 },
            { Hu: 232,  Ju: 76.1 },
            { Hu: 292,  Ju: 39.2 },
            { Hu: 307,  Ju: 45 },
        ]
        search_strongest_Ju_data.forEach( ({ Hu, Ju }) => {
            expect(find_strongest_Ju(Hu)).toBeCloseTo(Ju)
        })
    });

    test('find_strongest_ucs to return ucs for the highest chromatic color at a given Hu', () => {
        const search_strongest_ucs_data = [
            { Hu: 0,  hex: '#ff545a' },
            { Hu: 56,  hex: '#ffac4b' },
            { Hu: 112,  hex: '#ffec44' },
            { Hu: 155,  hex: '#68fd02' },
            { Hu: 232,  hex: '#03d9e5' },
            { Hu: 292,  hex: '#474afe' },
            { Hu: 307,  hex: '#9c2cff' },
        ]
        search_strongest_ucs_data.forEach( ({ Hu, hex }) => {
            expect(find_strongest_ucs(Hu).hex).toEqual(hex)
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

    test('cam16_ucs_adjust a color based on linear transform of components ', () => {
        const signed_distance_data = [
            { adj: { Jub: 20 }, color: { Hu: 30, Mu: 15, Ju: 35 }, result: [{ Ju: 55 }] },
            { adj: { Jua: 0, Jub: 20 }, color: { Hu: 30, Mu: 15, Ju: 35 }, result: [{ Ju: 20 }] },
            { adj: { Jub: -30, steps: 4 }, color: { Hu: 30, Mu: 15, Ju: 70 }, result: [{ Ju: 70 }, { Ju: 60 }, { Ju: 50 }, { Ju: 40 }] },
            { adj: { Hua: 0, Hub: 350, steps: 3 }, color: { Hu: 30, Mu: 15, Ju: 70 }, result: [{ Hu: 30 }, { Hu: 10 }, { Hu: -10 }] },
        ]
        signed_distance_data.forEach( ({ adj, color, result }) => {
            expect(cam16_ucs_adjust(adj, cam16_ucs_to_hex_ingamut(color))).toMatchObject(result)
        })
    });



})