"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nearley = require("nearley");
const grammar = require("../grammar");
const input = fs.readFileSync('./in.calc').toString();
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
parser.feed(input);
const result = parser.results[0].lines;
console.log("Valid programs:", parser.results.length);
// logging functions
const jsn = (o) => JSON.stringify(o);
const js = (o) => JSON.stringify(o, null, 4);
// substitution functions
const equivalent = (a, b) => {
    let equivalent = true;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (let key of aKeys) {
        if (bKeys.indexOf(key) === -1) {
            equivalent = false;
            return equivalent;
        }
    }
    for (let key of aKeys) {
        if (typeof a[key] === 'object' || typeof b[key] === 'object')
            continue;
        if (a[key] !== b[key]) {
            equivalent = false;
            return equivalent;
        }
    }
    return equivalent;
};
let charCounter = 1;
const clone = (obj) => {
    const cloneObj = JSON.parse(JSON.stringify(obj));
    const decollidedObj = rename(cloneObj, charCounter.toString(16));
    charCounter++;
    return decollidedObj;
};
const rename = (obj, id) => {
    for (let key of Object.keys(obj)) {
        if (typeof obj[key] === "object")
            obj[key] = rename(obj[key], id);
        else if (key === "name" || key === "variable")
            obj[key] = obj[key] + '_' + id;
    }
    return obj;
};
const dename = (obj) => {
    for (let key of Object.keys(obj)) {
        if (typeof obj[key] === "object")
            obj[key] = dename(obj[key]);
        else if (key === "name" || key === "variable")
            obj[key] = obj[key].split("_")[0];
    }
    return obj;
};
// reduction functions
const scope = {};
const substitute = (expression, oldTerm, replacingTerm) => {
    // console.log("START", js(expression), jsn(oldTerm), jsn(replacingTerm))
    if (expression.type === "abstraction") {
        if (equivalent(expression.definition, oldTerm)) {
            expression.definition = replacingTerm;
        }
        else
            expression.definition = substitute(expression.definition, oldTerm, replacingTerm);
    }
    if (expression.type === "variable") {
        if (equivalent(expression, oldTerm)) {
            expression = replacingTerm;
        }
    }
    if (expression.type === "application") {
        expression.function = substitute(expression.function, oldTerm, replacingTerm);
        expression.argument = substitute(expression.argument, oldTerm, replacingTerm);
    }
    // console.log("END")
    return expression;
};
const betaReduce = (term) => {
    if (term.type === 'variable') {
        const originalName = term.name.split('_')[0];
        if (scope[originalName] !== undefined) {
            return clone(scope[originalName]);
        }
        return term;
    }
    if (term.type !== 'application')
        return term;
    term.function = betaReduce(term.function);
    term.argument = betaReduce(term.argument);
    if (term.function.type === 'application') {
        // console.log("CALL A")
        term.function = betaReduce(term.function);
        return term;
    }
    if (term.function.type === 'abstraction') {
        // console.log("CALL B")\
        const partA = substitute(term.function.definition, term.function.variable, term.argument);
        return betaReduce(partA);
    }
    return term;
};
console.log('---');
/// main loop
result.forEach(line => {
    if (line.type === "bind") {
        const reducedExpression = betaReduce(line.value);
        scope[line.name.name] = reducedExpression;
    }
    else {
        const reducedExpression = betaReduce(line);
        console.log(js(dename(reducedExpression)));
    }
});
//# sourceMappingURL=index.js.map