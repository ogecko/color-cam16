"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const lodash_1 = require("lodash");
const fs_1 = require("fs");
console.log('Generate Color Names data');
const names0 = require('./winsor-newton.json');
const names1 = require('color-name-list/dist/colornames.bestof.json');
const names2 = require('color-name-list/dist/colornames.json');
const data = [];
const src = [names0, names1, names2];
src.forEach(d => d.forEach(x => {
    data.push(Object.assign({ key: x.hex, name: x.name, nameLen: x.name.length }, (0, index_1.JuMuHu_to_color)((0, index_1.hex_to_JuMuHu)(x.hex))));
}));
const results = (0, lodash_1.uniqBy)(data, x => x.hexLabel1).map(x => ({ label: x.hexLabel1, name: x.name }));
console.log(results);
const file = (0, fs_1.createWriteStream)('dist/color-names.js');
file.on('error', err => console.log(err));
file.write(`const colorNames = {\n`);
(0, lodash_1.sortBy)(results, x => x.label).forEach(x => file.write(`  "${x.label}": "${x.name}",\n`));
file.write(`}\n`);
file.write(`exports.colorNames = colorNames\n`);
file.end();
//# sourceMappingURL=generate.js.map