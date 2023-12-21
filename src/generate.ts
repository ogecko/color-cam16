import { hex_to_JuMuHu, JuMuHu_to_color } from './index'
import { uniqBy, sortBy } from 'lodash'
import { createWriteStream } from 'fs'

console.log('Generate Color Names data')

const names1=require('color-name-list/dist/colornames.bestof.json')
const names2=require('color-name-list/dist/colornames.json')

const data=[]
const src = [names1, names2]
src.forEach(d => d.forEach(x => {
    data.push(
        {
            key: x.hex, 
            name: x.name,
            nameLen: x.name.length,
            ...JuMuHu_to_color(hex_to_JuMuHu(x.hex))
        })
    })
)

// const sorted = sortBy(data, x => x.nameLen)
const results = uniqBy(data, x => x.hexLabel1).map(x => ({label: x.hexLabel1, name: x.name}))
console.log(results)

const file = createWriteStream('dist/color-names.js')
file.on('error', err => console.log(err))
file.write(`export const colorNames = {\n`);
sortBy(results, x => x.label).forEach(x => file.write(`  '${x.label}': '${x.name}',\n`))
file.write(`}\n`);
file.end();
