import { JuMuHuHex } from './types'
import { cam16_ucs_adjust } from './analysis'
import { cam16_ucs_to_hex_ingamut } from './transform_rev'
import { hex_to_cam16_ucs_ingamut } from './transform_fwd'

// functions passed to language.js
const cam16 = { 
    cam16_ucs_adjust, 
    cam16_ucs_to_hex_ingamut, 
    hex_to_cam16_ucs_ingamut 
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

export function parse_colors(text: string): JuMuHuHex[] {
    return jison_parse(text, cam16)
}

