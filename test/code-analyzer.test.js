import assert from 'assert';
//import {parseCode} from '../src/js/code-analyzer';
import {parseCode, varHandler, declarationHandler, assHandler, ifHandler, funDecHandler, returnHandler, whileHandler,
    forHandler, callTypeFunction, handleMap, recursiveHandle, htmlBuild} from '../src/js/code-analyzer';



describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });
});

let identifier1 = {'type': 'Identifier', 'name': 'X', 'loc': {'start': {'line': 1, 'column': 22}, 'end': {'line': 1, 'column': 23}}};
describe('Identifier Parse', () => {
    it('is handling identifier correctly', () => {
        assert.equal(
            JSON.stringify(varHandler(identifier1)),
            '[{"Line":1,"Type":"Identifier","Name":"X"}]'
        );
    });
    it('is handling identifier should return empty correctly', () => {
        assert.equal(
            JSON.stringify(varHandler(identifier1)),
            '[{"Line":1,"Type":"Identifier","Name":"X"}]'
        );
    });
});

let declaration1 = parseCode('let x = y + 6;')['body'][0]['declarations'][0];
let declaration2= parseCode('let x;')['body'][0]['declarations'][0];
describe('Declaration Parse', () => {
    it('is handling declaration correctly', () => {
        assert.equal(
            JSON.stringify(declarationHandler(declaration1)),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"x","Value":"y + 6"}]'
        );
    });
    it('is handling declaration null correctly', () => {
        assert.equal(
            JSON.stringify(declarationHandler(declaration2)),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"x","Value":null}]'
        );
    });
});

let ass1 = parseCode('x = y + 6;')['body'][0]['expression'];
let ass2 = parseCode('x += 6;')['body'][0]['expression'];
describe('Assignment Parse', () => {
    it('is handling assignment correctly', () => {
        assert.equal(
            JSON.stringify(assHandler(ass1)),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"x","Value":"y + 6"}]'
        );
    });
    it('is handling assignment += correctly', () => {
        assert.equal(
            JSON.stringify(assHandler(ass2)),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"x","Value":"x + 6"}]'
        );
    });
});

let if1 = parseCode('if(x > 9){}')['body'][0];
describe('If Parse', () => {
    it('is handling if correctly', () => {
        assert.equal(
            JSON.stringify(ifHandler(if1)),
            '[{"Line":1,"Type":"IfStatement","Condition":"x > 9"}]'
        );
    });
});

let funDec1 = parseCode('function myFunc(a,b,c){};')['body'][0];
describe('Function Declaration Parse', () => {
    it('is handling function declaration correctly', () => {
        assert.equal(
            JSON.stringify(funDecHandler(funDec1)),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"myFunc"},{"Line":1,"Type":"Identifier","Name":"a"},{"Line":1,"Type":"Identifier","Name":"b"},{"Line":1,"Type":"Identifier","Name":"c"}]'
        );
    });
});

let return1 = parseCode('function myFunc(a,b,c){return x+ 8;};')['body'][0]['body']['body'][0];
let return2 = parseCode('function myFunc(a,b,c){return;};')['body'][0]['body']['body'][0];
describe('Return Parse', () => {
    it('is handling return statement correctly', () => {
        assert.equal(
            JSON.stringify(returnHandler(return1)),
            '[{"Line":1,"Type":"ReturnStatement","Value":"x + 8"}]'
        );
    });
    it('is handling return null statement correctly', () => {
        assert.equal(
            JSON.stringify(returnHandler(return2)),
            '[{"Line":1,"Type":"ReturnStatement","Value":null}]'
        );
    });
});

let while1 = parseCode('while(x > y[6]){}')['body'][0];
describe('While Parse', () => {
    it('is handling while loop correctly', () => {
        assert.equal(
            JSON.stringify(whileHandler(while1)),
            '[{"Line":1,"Type":"WhileStatement","Condition":"x > y[6]"}]'
        );
    });
});

let for1 = parseCode('for(i=0;i<=5;i++){\n' + '}')['body'][0];
let for2 = parseCode('for(;;){\n' + '}')['body'][0];
describe('For Parse', () => {
    it('is handling for loop correctly', () => {
        assert.equal(
            JSON.stringify(forHandler(for1)),
            '[{"Line":1,"Type":"ForStatement","Condition":"i <= 5"},{"Line":1,"Type":"AssignmentExpression","Name":"i","Value":"0"},' +
            '{"Line":1,"Type":"UpdateExpression","Name":"i","Value":"i + 1"}]'
        );
    });
    it('is handling for loop with null arguments correctly', () => {
        assert.equal(
            JSON.stringify(forHandler(for2)),
            '[{"Line":1,"Type":"ForStatement","Condition":null}]'
        );
    });
});

let callFunType1 = parseCode('function func(a){\n' +
    'let x = 5 + 8;\n' +
    '}')['body'][0]['body']['body'][0]['declarations'][0];
describe('Call type function', () => {
    it('is call type function correctly', () => {
        assert.equal(
            JSON.stringify(callTypeFunction(callFunType1)),
            '[{"Line":2,"Type":"VariableDeclarator","Name":"x","Value":"5 + 8"}]'
        );
    });
});

describe('Mzp handle function', () => {
    it('is handle map function correctly', () => {
        assert.equal(
            JSON.stringify(handleMap(callFunType1)),
            '[{"Line":2,"Type":"VariableDeclarator","Name":"x","Value":"5 + 8"}]'
        );
    });
});

let recursiveHandler1 = parseCode('function func(a){\n' +
    'let x = 5 + 8;\n' +
    'if(x > a){\n' +
    'return 0;\n' +
    '}\n' +
    'return 1;\n' +
    '}');
let recursiveHandler2 = parseCode('demo();');
describe('recursive handle function', () => {
    it('is recursive handle function correctly', () => {
        assert.equal(
            JSON.stringify(recursiveHandle(recursiveHandler1)),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"func"},' +
            '{"Line":1,"Type":"Identifier","Name":"a"},' +
            '{"Line":2,"Type":"VariableDeclarator","Name":"x","Value":"5 + 8"},' +
            '{"Line":3,"Type":"IfStatement","Condition":"x > a"},' +
            '{"Line":4,"Type":"ReturnStatement","Value":"0"},' +
            '{"Line":6,"Type":"ReturnStatement","Value":"1"}]'
        );
    });
    it('is recursive handle function should return empty correctly', () => {
        assert.equal(
            JSON.stringify(recursiveHandle(recursiveHandler2)),
            '[]'
        );
    });
});


let htmlOutput ='<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>' +
    '<tr><td>1</td><td>FunctionDeclaration</td><td>func</td><td></td><td></td></tr>' +
    '<tr><td>1</td><td>Identifier</td><td>a</td><td></td><td></td></tr>'+
    '<tr><td>2</td><td>VariableDeclarator</td><td>x</td><td></td><td>5 + 8</td></tr>'+
    '<tr><td>3</td><td>IfStatement</td><td></td><td>x > a</td><td></td></tr>'+
    '<tr><td>4</td><td>ReturnStatement</td><td></td><td></td><td>0</td></tr>'+
    '<tr><td>6</td><td>ReturnStatement</td><td></td><td></td><td>1</td></tr>'+
    '</table>';
describe('html table function', () => {
    it('is html table function correctly', () => {
        assert.equal(
            htmlBuild(recursiveHandle(recursiveHandler1)), htmlOutput
        );
    });
});