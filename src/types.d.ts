// CAM16 is a new Color Appearance Model which supersedes CIECAM02
// It overcomes problems with CIECAM02 and also improves performance and visual results.
// See https://arxiv.org/pdf/1802.06067.pdf Algorithmic improvements for the CIECAM02 and CAM16 color appearance models
// CAM16 - Object with CAM16 components J: lightness[0-100] , Q: brightness[0-198], C: chroma[0-113], M: colorfulness[0-100], s: saturation[0-86], h: hue angle [0-360]
// J - Lightness            Red(46),  Yellow(94),  Green(79),  Cyan(85),  Blue(25),  Magenta(55),  White(100), Black(0), Grey50%(43)
// Q - Brightness           Red(134), Yellow(192), Green(175), Cyan(182), Blue(99),  Magenta(146), White(198), Black(0), Grey50%(130) 
// h - Hue angle            Red(27),  Yellow(111), Green(142), Cyan(196), Blue(283), Magenta(335), White(209), Black(0), Grey50%(209)
// M - Colorfulness         Red(99),  Yellow(66),  Green(94),  Cyan(51),  Blue(76),  Magenta(94),  White(2),   Black(0), Grey50%(1.26)
// C - Chroma               Red(113), Yellow(75),  Green(107), Cyan(58),  Blue(87),  Magenta(107), White(2),   Black(0), Grey50%(1.44)
// S - Saturation           Red(86),  Yellow(59),  Green(73),  Cyan(53),  Blue(87),  Magenta(80),  White(10),  Black(0), Grey50%(9.8)

// CAM16 UCS Uniform Color Space is an attempt to improve perceptual uniformity 
// so that a simple Euclidean distance can be used as the basis of a color difference metric. 
// It consists of hue h; lightness Ju (adj for ucs), colorfulness Mu (adj for ucs)
// or polar coordinates a and b where a: magenta-teal, b: yellow-blue 
// CAM16UCS - Object with CAM16UCS components J: lightness[0-100], M: colorfulness[0-52], h: hue angle [0-360], a:  b:  }
// Ju - Lightness            Red(59), Yellow(97),  Green(87),  Cyan(91),  Blue(36),  Magenta(68),  White(100), Black(0)
// h - Hue angle            Red(27), Yellow(111), Green(142), Cyan(196), Blue(283), Magenta(335), White(209), Black(0)
// Mu - Colorfulness        Red(52), Yellow(40),  Green(50),  Cyan(34),  Blue(44),  Magenta(50),  White(2),   Black(0)

// Some key colors in CAM16 space
//  #ff0000	 Red                h030 - Highest Colorfulness 99, Brightness 46 
//  #ffbb22	 Incandescence      h081 - Lowest Colorfulness 50, Brightness 74 (deep yellow)
//  #fdff00	 Lemon Glacier      h111 - Colorfulness 66, Highest Brightness 94
//  #00ff00	 Green              h142 - Highest Colorfulness 94, Brightness 79 
//  #11cc55	 Battletoad         h149 - Colorfulness 67, Lowest Brightness 61 (slight blueish green)
//  #00ffee	 Master Sword Blue  h188 - Colorfulness 52, Highest Brightness 84 (turquoise)
//  #04d9ff	 Neon Blue          h218 - Lowest Colorfulness 48, Brightness 71 (cyan)
//  #0000ff	 Blue               h282 - Colorfulness 76, Lowest Brightness 25
//  #ff00ff	 Magenta            h335 - Highest Colorfulness 93, Highest Brightness 55

// see https://arxiv.org/pdf/1802.06067.pdf CAM16UCS paper
// see https://observablehq.com/@jrus/cam16
// see https://gist.github.com/mheard03/49a22b37d1fb4c3968b8030f5f5a36e9#file-colorspace-cam16-js
// check with https://github.com/nschloe/colorio/blob/main/src/colorio/cs/_cam16.py
// compare with https://bottosson.github.io/posts/oklab/

// Utility Types for different color spaces
export type sRGB = [number, number, number]        // where R, G, B range from [0 to 1]
export type XYZ = [number, number, number]         // tristimulus values (under standard illuminant D65, normalized so that the luminance of the display white is Yw = 100Y)
export type CAM16 = {                              // Object with CAM16 components
    J:number,                                  // J: lightness[0-100] 
    Q:number,                                  // Q: brightness[0-198]
    C:number,                                  // C: chroma[0-113]
    M:number,                                  // M: colorfulness[0-100]
    s:number,                                  // s: saturation[0-86]
    h:number                                   // h: hue angle [0-360]
}
export type CAM16u = {                              // CAM16UCS - Object with CAM16 Universal Color Space components
    J:number,                                  // J: lightness[0-100] 
    Q:number,                                  // Q: brightness[0-198]
    C:number,                                  // C: chroma[0-113]
    M:number,                                  // M: colorfulness[0-100]
    s:number,                                  // s: saturation[0-86]
    h:number,                                  // h: hue angle [0-360]
    Ju:number,                                 // Ju: uniform lightness[0-100] 
    Mu:number,                                 // Mu: uniform colorfulness[0-100]
    Hu:number                                  // Hu: uniform hue angle [0-360]
}
export type JMh = {                              // Object with CAM16 components
    J:number,                                  // J: lightness[0-100] 
    M:number,                                  // M: colorfulness[0-100]
    h:number                                   // h: hue angle [0-360]
}
export type JuMuHu = {                              // Object with CAM16 components
    Ju:number,                                 // Ju: uniform lightness[0-100] 
    Mu:number,                                 // Mu: uniform colorfulness[0-100]
    Hu:number                                  // Hu: uniform hue angle [0-360]
}
export type JuMuHuHex = {                              // Object with CAM16 components
    Ju:number,                                 // Ju: uniform lightness[0-100] 
    Mu:number,                                 // Mu: uniform colorfulness[0-100]
    Hu:number,                                  // Hu: uniform hue angle [0-360]
    hex:string,                                 // hex: equivalent sRGB hex string for JuMuHu (if necc forced to be inGamut by reducing Mu)
    hexMu: number,                              // hexMu: uniform colorfulness[0-100] of ingamut hex value
    hexLabel1: string,                           // hexLabel: string label for ingamut UCS color equiv to hex value
    hexLabel2: string,                           // hexLabel: string label for ingamut UCS color equiv to hex value
    inGamut:boolean                             // inGamut: indicates if original JuMuHu components are in sRGB gamut, ie false=reduced Mu
}
