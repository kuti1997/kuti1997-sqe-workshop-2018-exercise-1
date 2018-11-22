/* eslint-disable complexity */
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

//Type Handlers
const varHandler = (code) =>{
    return {'Line': code['loc']['start']['line'], 'Type': code['type'], 'Name' : code['name']};
};

const declarationHandler = (code) =>{
    let value = null;
    if(code['init'] !== null)
    {
        value = escodegen.generate(code['init']);
    }
    return {'Line': code['id']['loc']['start']['line'], 'Type': code['type'], 'Name' : code['id']['name'], 'Value': value};
};

const assHandler = (code) =>{
    let value = null;
    if(code['right'] !== null)
    {
        value =  escodegen.generate(code['right']);
    }
    return {'Line': code['loc']['start']['line'], 'Type': code['type'], 'Name' : code['left']['name'], 'Value': value};
};

const ifHandler = (code) =>{
    let cond = null;
    if(code['test'] !== null)
    {
        cond = escodegen.generate(code['test']);
    }
    return {'Line': code['loc']['start']['line'], 'Type': code['type'], 'Condition' : cond};
};

const funDecHandler = (code) =>{
    return {'Line': code['id']['loc']['start']['line'], 'Type': code['type'], 'Name' : code['id']['name']};
};

const returnHandler = (code) =>{
    let value = null;
    if(code['argument'] !== null)
    {
        value = escodegen.generate(code['argument']);
    }
    return {'Line': code['loc']['start']['line'], 'Type': code['type'], 'Value': value};
};

const whileHandler = (code) =>{
    let cond = null;
    if(code['test'] !== null)
    {
        cond = escodegen.generate(code['test']);
    }
    return {'Line': code['loc']['start']['line'], 'Type': code['type'], 'Condition' : cond};
};

const forHandler = (code) =>{
    let cond = null;
    if(code['test'] !== null)
    {
        cond = escodegen.generate(code['test']);
    }
    return {'Line': code['loc']['start']['line'], 'Type': code['type'], 'Condition' : cond};
};
//End of Type Handlers

const TypeToHandler = {'IfStatement': ifHandler, 'FunctionDeclaration': funDecHandler, 'Identifier': varHandler,
    'VariableDeclarator': declarationHandler, 'AssignmentExpression': assHandler, 'ReturnStatement': returnHandler
    ,'WhileStatement': whileHandler, 'ForStatement': forHandler
};


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true});
};

const callTypeFunction = (code)=>{
    let toReturn = [];
    let func = TypeToHandler[code['type']];
    if(func !== undefined)
    {
        toReturn.push(func.call(undefined, code));
        if(code['type'] === 'FunctionDeclaration')
        {
            func = TypeToHandler['Identifier'];
            for(let x = 0; x < code['params'].length; x++)
            {
                toReturn.push(func.call(undefined, code['params'][x]));
            }
        }
    }
    return toReturn;
};

const handleMap = (code) =>{
    let toReturn = [];
    if(code.hasOwnProperty('type'))
    {
        if(code['type'] !== 'Identifier')
        {
            toReturn = toReturn.concat(callTypeFunction(code));
        }
        for(let x in code)
        {
            toReturn = toReturn.concat(recursiveHandle(code[x]));
        }
    }
    return toReturn;
};

const recursiveHandle = (code) => {
    let toReturn = [];
    if(code === undefined || code === null || typeof code === 'string' || typeof code === 'number')
    {
        return toReturn;
    }
    if(Array.isArray(code))
    {
        for(let i=0;i<code.length;i++)
        {
            let temp = recursiveHandle(code[i]);
            toReturn = toReturn.concat(temp);
        }
    }
    else
    {
        toReturn = toReturn.concat(handleMap(code));
    }
    return toReturn;
};

const htmlBuild = (arr) => {
    let htmlString = '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>';
    for(let i=0;i<arr.length;i++)
    {
        let object = arr[i];
        htmlString = htmlString + '<tr>';
        htmlString = htmlString + '<td>' + object['Line'] + '</td>';
        htmlString = htmlString + '<td>' + object['Type'] + '</td>';
        htmlString = htmlString + '<td>' + (object['Name'] !== undefined ? object['Name'] :'') + '</td>';
        htmlString = htmlString + '<td>' + (object['Condition'] !== undefined ? object['Condition'] :'') + '</td>';
        htmlString = htmlString + '<td>' + (object['Value'] !== undefined ? object['Value'] :'') + '</td>';
        htmlString = htmlString + '</tr>';
    }
    htmlString = htmlString + '</table>';
    return htmlString;
};


export {parseCode};
export {varHandler, declarationHandler, ifHandler, forHandler, assHandler, funDecHandler, returnHandler, whileHandler, handleMap};
export {recursiveHandle, callTypeFunction};
export {htmlBuild};