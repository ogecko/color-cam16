import { JuMuHu, CAM16u } from "./types"
import { c360, MuHu_to_ab } from "./utility"
import { JuMuHu_to_hex, JuMuHu_to_color } from "./transform_rev"

/**
 * Find the maximum Mu for a given Hu and Ju, using a recursive binary search
 * Max number of iterations to get 0.1 accuracy will be 10 iterations
 * If it cant find the max Mu after 13 iterations it will return 0
 * @param  {JuMuHu} ucs - starting color object (note Mu is ignored, only uses Ju: lightness [0..100], Hu: hue angle [0-360])
 * @param  {number} min (default=0) - optional known good Mu
 * @param  {number} max (default=100) - optional known out of gamut Mu
 * @param  {number} n (default=0) - number of iterations so far
 * @returns number - the maximum Mu for the given Hu and Ju, to an accuracy of +/- 0.1
 */
export function find_strongest_Mu(ucs: JuMuHu, min: number = 0, max: number = 100, n: number = 0): number {
    if (max - min < 0.1) return min
    if ((n++ > 13) || (n < 0)) return 0
    const half = (max + min) / 2
    const hex = JuMuHu_to_hex({ Ju: ucs.Ju, Mu: half, Hu: ucs.Hu })
    return (hex == '') ? find_strongest_Mu(ucs, min, half, n) : find_strongest_Mu(ucs, half, max, n)
}

/** Find the approximate dMu/dJu gradient at highest chroma for a given Hu and Ju
 * @param  {number} Hu - hue angle [0-360]
 * @param  {number} Ju - lightness [0..100]
 * @returns number - dMu/dJu gradient
 */
function gradient_dMu_dJu(Hu: number, Ju: number): number {
    const epsilon = 0.1
    const Mu1 = find_strongest_Mu({ Hu, Ju, Mu: 0 })
    const Mu2 = find_strongest_Mu({ Hu, Ju: Ju + epsilon, Mu: 0 })
    return (Mu2 - Mu1) / epsilon
}


/** Find the Ju which gives the strongest Mu for a given Hu
 * @param  {number} Hu - hue angle [0-360]
 * @param  {number=5} min - optional minimum Ju, for gradient descent search
 * @param  {number=95} max - optional maximum Ju, for gradient descent search
 * @param  {number=0} n - optional number of iterations so far, for gradient descent search
 * @param  {boolean=true} useLookup - use lookup rather than gradient descent
 * @returns number - Ju lightness [0..100]
 */
export function find_strongest_Ju(Hu: number, min: number = 5, max: number = 95, n: number = 0, useLookup = true): number {
    if (useLookup) {
        const lookup = [
            { "Ju": 59.6, "Hu": 0 },
            { "Ju": 62.2, "Hu": 14 },
            { "Ju": 67.9, "Hu": 28 },
            { "Ju": 72.4, "Hu": 42 },
            { "Ju": 76.2, "Hu": 55 },
            { "Ju": 79.9, "Hu": 69 },
            { "Ju": 83.6, "Hu": 83 },
            { "Ju": 87.4, "Hu": 97 },
            { "Ju": 91.7, "Hu": 110 },
            { "Ju": 94.9, "Hu": 124 },
            { "Ju": 88.0, "Hu": 138 },
            { "Ju": 85.1, "Hu": 152 },
            { "Ju": 61.1, "Hu": 166 },
            { "Ju": 67.4, "Hu": 180 },
            { "Ju": 75.1, "Hu": 193 },
            { "Ju": 81.8, "Hu": 207 },
            { "Ju": 89.8, "Hu": 221 },
            { "Ju": 76.1, "Hu": 235 },
            { "Ju": 67.1, "Hu": 249 },
            { "Ju": 58.7, "Hu": 263 },
            { "Ju": 45.3, "Hu": 276 },
            { "Ju": 39.2, "Hu": 290 },
            { "Ju": 45.0, "Hu": 304 },
            { "Ju": 62.8, "Hu": 318 },
            { "Ju": 63.0, "Hu": 332 },
            { "Ju": 63.1, "Hu": 346 },
            { "Ju": 59.6, "Hu": 360 }
        ]
        const n = lookup.length
        const span = 360 / (n - 1)
        const idx = Math.round((Hu % 360) / span)
        return lookup[idx].Ju
    } else {
        // use Gradient Descent Method
        if (max - min < 0.1) return min
        if ((n++ > 13) || (n < 0)) return min
        const half = (max + min) / 2
        const gradient = gradient_dMu_dJu(Hu, half)
        return (gradient < 0) ? find_strongest_Ju(Hu, min, half, n, useLookup)
            : find_strongest_Ju(Hu, half, max, n, useLookup)
    }
}

export function find_strongest_color(Hu: number): CAM16u {
    const Ju = find_strongest_Ju(Hu)
    const Mu = find_strongest_Mu({ Ju, Mu: 0, Hu })
    return JuMuHu_to_color({ Ju, Mu, Hu })
}

export function rainbow_colors({ Hu1 = 0, Hu2 = 360, steps = 13 }): CAM16u[] {
    if (steps == 0) {
        return [find_strongest_color(Hu1)]
    } else {
        return Array(steps + 1).fill(0).map((_, i) => {
            const Hu = Hu1 + i * (Hu2 - Hu1) / steps
            return find_strongest_color(Hu)
        })
    }
}


/**
 * Calculate the color difference metric between two colors in CAM16 UCS
 * Converting various colors from ucs to rgb back to ucs results in 95% with a DeltaE < 1.1
 * Comparing deep blue with bright yellow results in DeltaE > 25
 * Comparing black with white results in DeltaE > 25
 * @param  {JuMuHu} x - Object with CAM16UCS components { Ju: lightness, Mu: colorfulness, Hu: hue angle [0-360] } 
 * @param  {JuMuHu} y - Object with CAM16UCS components { Ju: lightness, Mu: colorfulness, Hu: hue angle [0-360] } 
 * @returns {number} - A value which represents the similarity of two colors (0=same, 25=very different) 
 */
export function delta_e(x: JuMuHu, y: JuMuHu): number {
    const xab = MuHu_to_ab(x)
    const yab = MuHu_to_ab(y)
    const da = xab.a - yab.a, db = xab.b - yab.b, dj = x.Ju - y.Ju;
    return 1.41 * Math.pow(dj * dj + da * da + db * db, 0.315);
}


/** 
 * Find the shortest signed distance between two angles a and b
 * @param  {number} a = Starting angle in degrees
 * @param  {number} b - Ending angle in degress
 * @returns number - Signed number of degrees to get from angle a to angle b, in the shortest path (ie result always gte -180 and lte 180) 
 */
export function shortest_signed_distance(a: number, b: number): number {
    const isBackwards = (a > b)
    const abs_diff = isBackwards ? a - b : b - a
    const mod_diff = c360(abs_diff)
    const isShortcut = (mod_diff > 180)
    const shortest = isShortcut ? 360 - mod_diff : mod_diff
    return (isBackwards && !isShortcut) || (!isBackwards && isShortcut) ? -shortest : shortest
}

/**
 * Create an Array of adjusted Colors based on a linear tranfsofrm of each component.
 * The adjustment object defines the linear transform formula Cn' = Cn * a + b
 * where Cn is the initial input color and Cn' is its final adjusted color, (multiple input colors are supported).
 * The values for a and b are defined for each color component Ju, Hu or Mu.
 * Each input color Cn is transformed into a series of colors from Cn to Cn' (when steps=1 only the final colors are returned)
 * @param  {object} adj - Color adjustment definition object
 * @param  {number} adj.Jua=1 - Optional definition of lightness multiplier a
 * @param  {number} adj.Jub=0 - Optional definition of lightness addition b
 * @param  {number} adj.Mua=1 - Optional definition of colorfulness multiplier a
 * @param  {number} adj.Mub=0 - Optional definition of colorfulness addition b
 * @param  {number} adj.Hua=1 - Optional definition of hue angle multiplier a. If Hua==0 then take shortest path to Hub
 * @param  {number} adj.Hub=0 - Optional definition of hue angle addition b
 * @param  {number} adj.steps=1 - Optional number of adjusted colors for each input color
 * @param  {boolean} adj.contrast=false - Optional flag to indicate lightness change by contrast, ie if Cn.Ju>50 then negative Jub
 * @param  {JuMuHu} color1,color2,color3, ... - Input color object(s) to adjust
 * @returns {CAM16u[]} - A flattened Array of objects holding the adjusted colors
 */
export function adjust_colors({ Jua = 1, Jub = 0, Mua = 1, Mub = 0, Hua = 1, Hub = 0, steps = 1, contrast = false }, ...colors: CAM16u[]): CAM16u[] {
    // for each of the colors in the arguments
    return colors.map(Cn => {
        // work out the starting and finishing colors
        const cc = (contrast && Cn.Ju > 50) ? -1 : 1
        const cs = { Ju: Cn.Ju, Mu: Cn.Mu, Hu: Cn.Hu }
        const cf = { Ju: Cn.Ju * Jua + Jub * cc, Mu: Cn.Mu * Mua + Mub, Hu: Cn.Hu * Hua + Hub }
        // create array if steps > 1
        if (steps == 1) {
            return [JuMuHu_to_color(cf)]
        } else {
            const dJu = (cf.Ju - cs.Ju) / (steps - 1)
            const dMu = (cf.Mu - cs.Mu) / (steps - 1)
            const dHu = (Hua == 1) ? (cf.Hu - cs.Hu) / (steps - 1) : shortest_signed_distance(cs.Hu, cf.Hu) / (steps - 1)
            return Array(steps).fill(0).map((_, i) => {
                const ct = {
                    Ju: cs.Ju + i * dJu,
                    Mu: cs.Mu + i * dMu,
                    Hu: cs.Hu + i * dHu
                }
                return JuMuHu_to_color(ct)
            })
        }
        // flatten the array of arrays to a single array of colors
    }).reduce((acc, val) => acc.concat(val), [])
}
