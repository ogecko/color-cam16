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

![](https://readme-swatches.vercel.app/d5b8fd)<br>
![](https://readme-swatches.vercel.app/bda0e5)
![](https://readme-swatches.vercel.app/bf9def)
![](https://readme-swatches.vercel.app/c199fa)<br>
![](https://readme-swatches.vercel.app/a589cd)
![](https://readme-swatches.vercel.app/a786d7)
![](https://readme-swatches.vercel.app/a982e2)
![](https://readme-swatches.vercel.app/ac7dee)
![](https://readme-swatches.vercel.app/ae77fc)<br>
![](https://readme-swatches.vercel.app/8e72b6)
![](https://readme-swatches.vercel.app/906ec0)
![](https://readme-swatches.vercel.app/926acb)
![](https://readme-swatches.vercel.app/9565d8)
![](https://readme-swatches.vercel.app/975ee5)
![](https://readme-swatches.vercel.app/9a56f5)<br>
![](https://readme-swatches.vercel.app/775ba0)
![](https://readme-swatches.vercel.app/7957aa)
![](https://readme-swatches.vercel.app/7c53b5)
![](https://readme-swatches.vercel.app/7e4cc2)
![](https://readme-swatches.vercel.app/8044d0)
![](https://readme-swatches.vercel.app/8338e0)
![](https://readme-swatches.vercel.app/8624f3)<br>
![](https://readme-swatches.vercel.app/604489)
![](https://readme-swatches.vercel.app/623f93)
![](https://readme-swatches.vercel.app/64399f)
![](https://readme-swatches.vercel.app/6731ac)
![](https://readme-swatches.vercel.app/6924bb)
![](https://readme-swatches.vercel.app/6c03cd)<br>
![](https://readme-swatches.vercel.app/482972)
![](https://readme-swatches.vercel.app/4a237d)
![](https://readme-swatches.vercel.app/4c1989)
![](https://readme-swatches.vercel.app/4e0198)<br>
![](https://readme-swatches.vercel.app/2c025a)

- rainbow_colors
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
  
