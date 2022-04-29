import { CAM16u } from './types'
import { adjust_colors, rainbow_colors } from './analysis'
import { JuMuHu_to_color, label_to_color } from './transform_rev'

// functions passed to language.js
const cam16 = { 
    JuMuHu_to_color,
    label_to_color,
    adjust_colors, 
    rainbow_colors,
}

/////////////////////////////////////////////////////////////////////////////////
// WARNING - with OPTION2 whenever language.json is changed, must re-run jison //
/////////////////////////////////////////////////////////////////////////////////

// OPTION 1: Runtime generation of parse
// import { Parser } from 'jison'
// import { readFileSync } from 'fs'
// const grammar = readFileSync('./language.json', 'utf8')
// const theme_grammar = (new Parser(JSON.parse(grammar)))
// const parse = function (t:string, c:Cam16) { return theme_grammar.parse.apply(theme_grammar, [t, c]); };

// OPTION 2 Buildtime generation of parse with command 'jison language.json'
import { parse as jison_parse } from './language'

export function parse_colors(text: string): CAM16u[] {
    return jison_parse(text, cam16)
}

