@{%
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
%}

@lexer lexer

program -> (line:? %nl):* {%
    (data) => {
        const lines = data[0].map(lineGroup => lineGroup[0])
            .filter(line => line !== null);

        return {
            type: 'program',
            lines: lines
        }
    }
%}

line -> (expression | bind) {% 
    (data) => {
        return data[0][0]
    }
%}

bind -> variable %ws:? %eq %ws:? expression {% 
    (data) => {
        return {
            type: 'bind',
            name: data[0],
            value: data[4]
        }
    }
%}

expression -> 
      abstraction {% id %}
    | application {% id %}
    | variable {% id %}
    | %lp expression %rp {%
    (data) => {
        return data[1]
    }    
%}

abstraction -> %lambda variable %dot expression {%
    (data) => {
        return {
            type: 'abstraction',
            variable: data[1],
            definition: data[3]
        }
    }
%}

application -> %lp expression %ws expression %rp {%
    (data) => {
        return {
            type: 'application',
            function: data[1],
            argument: data[3]
        }
    }
%}

variable -> %v {%
    (data) => {
        return {
            type: 'variable',
            name: data[0].value
        }
    }
%}