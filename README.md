# color-cam16
Perceptual Color Space and Language based on the CAM16 Uniform Color Space

## Defining and Manipulating Colors
color-cam16 is a TypeScript library for defining and manipulating colors. Generate color sequences. Define color relationships. Determine color differences. Find analogous and complimentary colors. Ensure color contrast. Match real world colors.

The library uses a uniform color space based on human perception and human semantics.  You can define a set of colors by their relationships in plain text. Define colors as warmer, cooler, lighter,  darker, stronger, weaker, analogous, triadic, or complimentary. Declare how many steps between colors to form color sequences.  The library will parse the color description and generate a set of colors.

## Color Language
###  `parse_colors(text: string): CAM16u[]`

```
require { parse_colors } import 'color-cam16'

color_gradient = parse_colors('1A5 to 9Z5 in 5 steps')
warm_colors = parse_colors('1A5 to 9Z5 in 15 steps')
cool_colors = parse_colors('9a5 to 1z5 in 15 steps')
rainbow = parse_colors('rainbow in 26 steps')
hue_A = parse_colors('0A0 lighter to 100 in 11 steps, stronger to 50 in 10 steps')

```
Color gradient

![](https://readme-swatches.vercel.app/2d035a)
![](https://readme-swatches.vercel.app/84384b)
![](https://readme-swatches.vercel.app/b96c41)
![](https://readme-swatches.vercel.app/d9a852)
![](https://readme-swatches.vercel.app/eee88b)

Warm colors

![](https://readme-swatches.vercel.app/2d035a)
![](https://readme-swatches.vercel.app/4b1657)
![](https://readme-swatches.vercel.app/652453)
![](https://readme-swatches.vercel.app/7b314e)
![](https://readme-swatches.vercel.app/8d3f48)
![](https://readme-swatches.vercel.app/9e4e44)
![](https://readme-swatches.vercel.app/ac5d42)
![](https://readme-swatches.vercel.app/b96c41)
![](https://readme-swatches.vercel.app/c47c42)
![](https://readme-swatches.vercel.app/cd8d46)
![](https://readme-swatches.vercel.app/d59f4d)
![](https://readme-swatches.vercel.app/dcb158)
![](https://readme-swatches.vercel.app/e2c367)
![](https://readme-swatches.vercel.app/e9d578)
![](https://readme-swatches.vercel.app/eee88b)

Cool Colors 

![](https://readme-swatches.vercel.app/e7ea90)
![](https://readme-swatches.vercel.app/ccdf8b)
![](https://readme-swatches.vercel.app/afd489)
![](https://readme-swatches.vercel.app/93c88a)
![](https://readme-swatches.vercel.app/75bc8e)
![](https://readme-swatches.vercel.app/5bb08f)
![](https://readme-swatches.vercel.app/42a38c)
![](https://readme-swatches.vercel.app/26958a)
![](https://readme-swatches.vercel.app/018787)
![](https://readme-swatches.vercel.app/027781)
![](https://readme-swatches.vercel.app/006779)
![](https://readme-swatches.vercel.app/005770)
![](https://readme-swatches.vercel.app/00456a)
![](https://readme-swatches.vercel.app/042c73)
![](https://readme-swatches.vercel.app/200962)

Rainbow Colors 

![](https://readme-swatches.vercel.app/ff545a)
![](https://readme-swatches.vercel.app/ff6843)
![](https://readme-swatches.vercel.app/ff8647)
![](https://readme-swatches.vercel.app/ff9b4b)
![](https://readme-swatches.vercel.app/ffab4d)
![](https://readme-swatches.vercel.app/ffbb4f)
![](https://readme-swatches.vercel.app/ffca52)
![](https://readme-swatches.vercel.app/ffda55)
![](https://readme-swatches.vercel.app/ffeb56)
![](https://readme-swatches.vercel.app/f6fd02)
![](https://readme-swatches.vercel.app/c4f401)
![](https://readme-swatches.vercel.app/7ff902)
![](https://readme-swatches.vercel.app/00bb4c)
![](https://readme-swatches.vercel.app/00c98b)
![](https://readme-swatches.vercel.app/02dcb1)
![](https://readme-swatches.vercel.app/05edd5)
![](https://readme-swatches.vercel.app/56fffc)
![](https://readme-swatches.vercel.app/07d8e9)
![](https://readme-swatches.vercel.app/00bedf)
![](https://readme-swatches.vercel.app/03a5d6)
![](https://readme-swatches.vercel.app/027dce)
![](https://readme-swatches.vercel.app/3d4dff)
![](https://readme-swatches.vercel.app/933aff)
![](https://readme-swatches.vercel.app/e855ff)
![](https://readme-swatches.vercel.app/ff51c5)
![](https://readme-swatches.vercel.app/ff6191)

Hue A

![](https://readme-swatches.vercel.app/000000)<br>
![](https://readme-swatches.vercel.app/222121)
![](https://readme-swatches.vercel.app/232028)
![](https://readme-swatches.vercel.app/251d32)
![](https://readme-swatches.vercel.app/28183e)
![](https://readme-swatches.vercel.app/2b0e4f)<br>
![](https://readme-swatches.vercel.app/3d3d3c)
![](https://readme-swatches.vercel.app/3f3b43)
![](https://readme-swatches.vercel.app/41384d)
![](https://readme-swatches.vercel.app/443559)
![](https://readme-swatches.vercel.app/472f69)
![](https://readme-swatches.vercel.app/4a247d)
![](https://readme-swatches.vercel.app/4f0398)<br>
![](https://readme-swatches.vercel.app/565554)
![](https://readme-swatches.vercel.app/57535c)
![](https://readme-swatches.vercel.app/595065)
![](https://readme-swatches.vercel.app/5c4d71)
![](https://readme-swatches.vercel.app/5f4881)
![](https://readme-swatches.vercel.app/634094)
![](https://readme-swatches.vercel.app/6732ad)
![](https://readme-swatches.vercel.app/6c06ce)<br>
![](https://readme-swatches.vercel.app/6d6b6b)
![](https://readme-swatches.vercel.app/6e6a72)
![](https://readme-swatches.vercel.app/71677c)
![](https://readme-swatches.vercel.app/736488)
![](https://readme-swatches.vercel.app/775f98)
![](https://readme-swatches.vercel.app/7a58ab)
![](https://readme-swatches.vercel.app/7f4dc2)
![](https://readme-swatches.vercel.app/843ae1)<br>
![](https://readme-swatches.vercel.app/848282)
![](https://readme-swatches.vercel.app/858089)
![](https://readme-swatches.vercel.app/887e93)
![](https://readme-swatches.vercel.app/8a7a9f)
![](https://readme-swatches.vercel.app/8e76af)
![](https://readme-swatches.vercel.app/9170c1)
![](https://readme-swatches.vercel.app/9666d9)
![](https://readme-swatches.vercel.app/9b57f6)<br>
![](https://readme-swatches.vercel.app/9b9998)
![](https://readme-swatches.vercel.app/9c97a0)
![](https://readme-swatches.vercel.app/9f95aa)
![](https://readme-swatches.vercel.app/a191b6)
![](https://readme-swatches.vercel.app/a58dc6)
![](https://readme-swatches.vercel.app/a987d8)
![](https://readme-swatches.vercel.app/ad7ef0)<br>
![](https://readme-swatches.vercel.app/b2b0b0)
![](https://readme-swatches.vercel.app/b4aeb7)
![](https://readme-swatches.vercel.app/b6acc2)
![](https://readme-swatches.vercel.app/b9a9ce)
![](https://readme-swatches.vercel.app/bda4de)
![](https://readme-swatches.vercel.app/c19ff0)<br>
![](https://readme-swatches.vercel.app/cbc9c8)
![](https://readme-swatches.vercel.app/cdc7d0)
![](https://readme-swatches.vercel.app/cfc4da)
![](https://readme-swatches.vercel.app/d2c1e7)
![](https://readme-swatches.vercel.app/d5bdf7)<br>
![](https://readme-swatches.vercel.app/e5e3e2)
![](https://readme-swatches.vercel.app/e7e1ea)
![](https://readme-swatches.vercel.app/e9def4)<br>
![](https://readme-swatches.vercel.app/ffffff)<br>
![](https://readme-swatches.vercel.app/)
- adjust_color

## Color Space Transforms
- JuMuHu_to_color
- label_to_color
## Color Space Analysis
- delta_e
- find_closest_color
- find_strongest_color
- find_strongest_Mu
- cluster_colors

## Color Names
- label_to_name
- name_to_color
- find_closet_names
  
