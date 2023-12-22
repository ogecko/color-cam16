"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjust_colors = exports.shortest_signed_distance = exports.delta_e = exports.rainbow_colors = exports.find_strongest_color = exports.find_strongest_Ju = exports.find_strongest_Mu = void 0;
const utility_1 = require("./utility");
const transform_rev_1 = require("./transform_rev");
function find_strongest_Mu(ucs, min = 0, max = 47, n = 0) {
    if (max - min < 0.1)
        return min;
    if ((n++ > 13) || (n < 0))
        return 0;
    const half = (max + min) / 2;
    const hex = (0, transform_rev_1.JuMuHu_to_hex)({ Ju: ucs.Ju, Mu: half, Hu: ucs.Hu });
    return (hex == '') ? find_strongest_Mu(ucs, min, half, n) : find_strongest_Mu(ucs, half, max, n);
}
exports.find_strongest_Mu = find_strongest_Mu;
function gradient_dMu_dJu(Hu, Ju) {
    const epsilon = 0.1;
    const Mu1 = find_strongest_Mu({ Hu, Ju, Mu: 0 });
    const Mu2 = find_strongest_Mu({ Hu, Ju: Ju + epsilon, Mu: 0 });
    return (Mu2 - Mu1) / epsilon;
}
function find_strongest_Ju(Hu, min = 5, max = 94, n = 0, useLookup = true) {
    if (useLookup) {
        const lookup = [
            { "Ju": 50, "Hu": 0 },
            { "Ju": 50, "Hu": 14 },
            { "Ju": 60, "Hu": 28 },
            { "Ju": 60, "Hu": 42 },
            { "Ju": 70, "Hu": 55 },
            { "Ju": 70, "Hu": 69 },
            { "Ju": 80, "Hu": 83 },
            { "Ju": 80, "Hu": 97 },
            { "Ju": 90, "Hu": 110 },
            { "Ju": 90, "Hu": 124 },
            { "Ju": 90, "Hu": 138 },
            { "Ju": 80, "Hu": 152 },
            { "Ju": 70, "Hu": 166 },
            { "Ju": 70, "Hu": 180 },
            { "Ju": 80, "Hu": 193 },
            { "Ju": 80, "Hu": 207 },
            { "Ju": 80, "Hu": 221 },
            { "Ju": 80, "Hu": 235 },
            { "Ju": 70, "Hu": 249 },
            { "Ju": 60, "Hu": 263 },
            { "Ju": 60, "Hu": 276 },
            { "Ju": 30, "Hu": 290 },
            { "Ju": 50, "Hu": 304 },
            { "Ju": 60, "Hu": 318 },
            { "Ju": 60, "Hu": 332 },
            { "Ju": 50, "Hu": 346 },
            { "Ju": 50, "Hu": 360 }
        ];
        const n = lookup.length;
        const span = 360 / (n - 1);
        const idx = Math.round((Hu % 360) / span);
        return lookup[idx].Ju;
    }
    else {
        if (max - min < 0.1)
            return min;
        if ((n++ > 13) || (n < 0))
            return min;
        const half = (max + min) / 2;
        const gradient = gradient_dMu_dJu(Hu, half);
        return (gradient < 0) ? find_strongest_Ju(Hu, min, half, n, useLookup)
            : find_strongest_Ju(Hu, half, max, n, useLookup);
    }
}
exports.find_strongest_Ju = find_strongest_Ju;
function find_strongest_color(Hu) {
    const Ju = find_strongest_Ju(Hu);
    const Mu = find_strongest_Mu({ Ju, Mu: 0, Hu });
    return (0, transform_rev_1.JuMuHu_to_color)({ Ju, Mu, Hu });
}
exports.find_strongest_color = find_strongest_color;
function rainbow_colors({ Hu1 = 0, Hu2 = 360, steps = 13 }) {
    if (steps == 0) {
        return [find_strongest_color(Hu1)];
    }
    else {
        return Array(steps + 1).fill(0).map((_, i) => {
            const Hu = Hu1 + i * (Hu2 - Hu1) / steps;
            return find_strongest_color(Hu);
        });
    }
}
exports.rainbow_colors = rainbow_colors;
function delta_e(x, y) {
    const xab = (0, utility_1.MuHu_to_ab)(x);
    const yab = (0, utility_1.MuHu_to_ab)(y);
    const da = xab.a - yab.a, db = xab.b - yab.b, dj = x.Ju - y.Ju;
    return 1.41 * Math.pow(dj * dj + da * da + db * db, 0.315);
}
exports.delta_e = delta_e;
function shortest_signed_distance(a, b) {
    const isBackwards = (a > b);
    const abs_diff = isBackwards ? a - b : b - a;
    const mod_diff = (0, utility_1.c360)(abs_diff);
    const isShortcut = (mod_diff > 180);
    const shortest = isShortcut ? 360 - mod_diff : mod_diff;
    return (isBackwards && !isShortcut) || (!isBackwards && isShortcut) ? -shortest : shortest;
}
exports.shortest_signed_distance = shortest_signed_distance;
function adjust_colors({ Jua = 1, Jub = 0, Mua = 1, Mub = 0, Hua = 1, Hub = 0, steps = 1, contrast = false }, ...colors) {
    return colors.map(Cn => {
        const cc = (contrast && Cn.Ju > 50) ? -1 : 1;
        const cs = { Ju: Cn.Ju, Mu: Cn.Mu, Hu: Cn.Hu };
        const cf = { Ju: Cn.Ju * Jua + Jub * cc, Mu: Cn.Mu * Mua + Mub, Hu: Cn.Hu * Hua + Hub };
        if (steps == 1) {
            return [(0, transform_rev_1.JuMuHu_to_color)(cf)];
        }
        else {
            const dJu = (cf.Ju - cs.Ju) / (steps - 1);
            const dMu = (cf.Mu - cs.Mu) / (steps - 1);
            const dHu = (Hua == 1) ? (cf.Hu - cs.Hu) / (steps - 1) : shortest_signed_distance(cs.Hu, cf.Hu) / (steps - 1);
            return Array(steps).fill(0).map((_, i) => {
                const ct = {
                    Ju: cs.Ju + i * dJu,
                    Mu: cs.Mu + i * dMu,
                    Hu: cs.Hu + i * dHu
                };
                return (0, transform_rev_1.JuMuHu_to_color)(ct);
            });
        }
    }).reduce((acc, val) => acc.concat(val), []);
}
exports.adjust_colors = adjust_colors;
//# sourceMappingURL=analysis.js.map