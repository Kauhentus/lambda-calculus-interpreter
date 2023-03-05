"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moo = require("moo");
const fs = require("fs");
const lexer = moo.compile({
    ws: /[ \t]+/,
    comment: /\/\/.*?$/,
    num: /[0-9]+/,
    lp: '(',
    rp: ')',
    eq: '=:',
    lambda: '\\',
    dot: '.',
    nl: { match: /\n/, lineBreaks: true },
    var: /[a-z]+/,
});
console.log("hi");
const input = fs.readFileSync('./in.calc').toString();
lexer.reset(input);
for (let token of lexer) {
    console.log(token);
}
//# sourceMappingURL=index.js.map