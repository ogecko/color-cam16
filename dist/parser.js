"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_colors = void 0;
const analysis_1 = require("./analysis");
const transform_rev_1 = require("./transform_rev");
const cam16 = {
    JuMuHu_to_color: transform_rev_1.JuMuHu_to_color,
    label_to_color: transform_rev_1.label_to_color,
    adjust_colors: analysis_1.adjust_colors,
    rainbow_colors: analysis_1.rainbow_colors,
};
const language_1 = require("./language");
function parse_colors(text) {
    return (0, language_1.parse)(text, cam16);
}
exports.parse_colors = parse_colors;
//# sourceMappingURL=parser.js.map