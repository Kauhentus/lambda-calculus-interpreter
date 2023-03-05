// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

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
    v: /[a-z]+/,
})
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1$subexpression$1$ebnf$1", "symbols": ["line"], "postprocess": id},
    {"name": "program$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["program$ebnf$1$subexpression$1$ebnf$1", (lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": 
        (data) => {
            const lines = data[0].map(lineGroup => lineGroup[0])
                .filter(line => line !== null);
        
            return {
                type: 'program',
                lines: lines
            }
        }
        },
    {"name": "line$subexpression$1", "symbols": ["expression"]},
    {"name": "line$subexpression$1", "symbols": ["bind"]},
    {"name": "line", "symbols": ["line$subexpression$1"], "postprocess":  
        (data) => {
            return data[0][0]
        }
        },
    {"name": "bind$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "bind$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bind$ebnf$2", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "bind$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bind", "symbols": ["variable", "bind$ebnf$1", (lexer.has("eq") ? {type: "eq"} : eq), "bind$ebnf$2", "expression"], "postprocess":  
        (data) => {
            return {
                type: 'bind',
                name: data[0],
                value: data[4]
            }
        }
        },
    {"name": "expression", "symbols": ["abstraction"], "postprocess": id},
    {"name": "expression", "symbols": ["application"], "postprocess": id},
    {"name": "expression", "symbols": ["variable"], "postprocess": id},
    {"name": "expression", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "expression", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": 
        (data) => {
            return data[1]
        }    
        },
    {"name": "abstraction", "symbols": [(lexer.has("lambda") ? {type: "lambda"} : lambda), "variable", (lexer.has("dot") ? {type: "dot"} : dot), "expression"], "postprocess": 
        (data) => {
            return {
                type: 'abstraction',
                variable: data[1],
                definition: data[3]
            }
        }
        },
    {"name": "application", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "expression", (lexer.has("ws") ? {type: "ws"} : ws), "expression", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": 
        (data) => {
            return {
                type: 'application',
                function: data[1],
                argument: data[3]
            }
        }
        },
    {"name": "variable", "symbols": [(lexer.has("v") ? {type: "v"} : v)], "postprocess": 
        (data) => {
            return {
                type: 'variable',
                name: data[0].value
            }
        }
        }
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
