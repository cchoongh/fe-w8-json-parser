import { Type } from './const.js';
import Queue from './container/Queue.js';
import Stack from './container/Stack.js';
import SyntaxTree from './syntax-tree/SyntaxTree.js';
import SyntaxTreeNode from './syntax-tree/SyntaxTreeNode.js';
// FIXME: reference issue? => deep copy 'tokens'..

let arrayDepth = 0;
const arrayDepthStack = new Stack();
arrayDepthStack.push(0);
let numCount = 0;
let strCount = 0;

export function parse(tokens) {
  arrayDepth = 0;
  numCount = 0;
  strCount = 0;
  const syntaxTree = new SyntaxTree();
  childParse({ parentNode: syntaxTree.getRoot(), tokens });
  arrayDepth = Math.max(arrayDepthStack.stack);
  console.log(arrayDepth);
  return {syntaxTree:syntaxTree, arrayDepth:arrayDepth, numCount, strCount};
}

function childParse({ parentNode, tokens }) {
  const tokenQueue = new Queue({ initialData: tokens });

  while (!tokenQueue.empty()) { // shift tokenQueue until it's empty
    const currToken = tokenQueue.shift();

    if (currToken.type === Type.RBRAKET || currToken.type === Type.RBRACE)
      throw new Error(`Invalid syntax, unmatched ${currToken.value}`);

    if (parentNode.getType() === Type.OBJECT) { // if parent node is object
      const propKeyToken = currToken;

      if (propKeyToken.type !== Type.STRING)  // key is should be "key"
        throw new Error('A key in object is not string type!');

      if (tokenQueue.shift().type !== Type.COLON) // next of "key" is shold be :
        throw new Error(`Invalid syntax, ':' is not exist!`);

      const objPropNode = new SyntaxTreeNode({ type: Type.OBJECT_PROPERTY });
      const valueNode = new SyntaxTreeNode({ propKey: new SyntaxTreeNode(propKeyToken) });
      const propValueToken = tokenQueue.shift();

      if (propValueToken.type === Type.STRING || propValueToken.type === Type.BOOLEAN || propValueToken.type === Type.NUMBER) {
        if(propValueToken.type === Type.STRING) strCount++;
        if(propValueToken.type === Type.NUMBER) numCount++;
        const propValueNode = new SyntaxTreeNode(propValueToken);
        valueNode.setPropValue(propValueNode);
      } else if (propValueToken.type === Type.LBRAKET) {    // if value token is array
        arrayDepth++;
        arrayDepthStack.push(arrayDepth);
        const propValueNode = new SyntaxTreeNode({ type: Type.ARRAY, value: 'arrayObject' });
        childParse({    // recursion this function with array type
          parentNode: propValueNode,
          tokens: getPartialTokens({ rightType: Type.RBRAKET, tokenQueue }),
        });
        valueNode.setPropValue(propValueNode);
      } else if (propValueToken.type === Type.LBRACE) {   // if value token is object
        const propValueNode = new SyntaxTreeNode({ type: Type.OBJECT });
        childParse({  // recursion this function with object type
          parentNode: propValueNode,
          tokens: getPartialTokens({ rightType: Type.RBRACE, tokenQueue })
        });
        valueNode.setPropValue(propValueNode);
      } else {
        throw new Error(`Invalid propValue type, ${propValueToken.type}`);
      }

      objPropNode.setValue(valueNode);
      parentNode.appendChild(objPropNode);
      continue;   // object case of parent node is end
    }

    if (currToken.type === Type.LBRAKET) {    // if token is [
      arrayDepth++;
      arrayDepthStack.push(arrayDepth);
      const newNode = new SyntaxTreeNode({ type: Type.ARRAY, value: 'arrayObject' });
      childParse({
        parentNode: newNode,
        tokens: getPartialTokens({ rightType: Type.RBRAKET, tokenQueue }),
      });
      parentNode.appendChild(newNode);
    } else if (currToken.type === Type.LBRACE) {
      const newNode = new SyntaxTreeNode({ type: Type.OBJECT });
      childParse({
        parentNode: newNode,
        tokens: getPartialTokens({ rightType: Type.RBRACE, tokenQueue })
      });
      parentNode.appendChild(newNode);
    } else if (currToken.type === Type.COLON) {
      throw new Error(`Invalid syntax, invalid ':'`);
    } else if (currToken.type === Type.STRING || currToken.type === Type.BOOLEAN || currToken.type === Type.NUMBER || currToken.type === Type.NULL) {
      if(currToken.type === Type.STRING) strCount++;
      if(currToken.type === Type.NUMBER) numCount++;
      const newNode = new SyntaxTreeNode({ type: currToken.type, value : currToken.value });
      parentNode.appendChild(newNode);
    } else {
      throw new Error(`Invalid tokens, ${tokens}`);
    }
  }
}

export function getPartialTokens({ rightType, tokenQueue }) {
  const result = [];
  let leftType;
  let leftTypeCnt = 0;

  if (rightType === Type.RBRAKET) {
    leftType = Type.LBRAKET;
    arrayDepth--;
    arrayDepthStack.push(arrayDepth);
  }
  else if (rightType === Type.RBRACE)
    leftType = Type.LBRACE;
  else
    throw new Error(`Invalid argument, ${rightType}`);

  while (!tokenQueue.empty()) {
    const token = tokenQueue.shift();

    if (token.type === leftType)
      leftTypeCnt++;
    else if (token.type === rightType) {
      if (leftTypeCnt > 0) {
        leftTypeCnt--;
      }
      else if (leftTypeCnt === 0)
        break;
      else
        throw new Error(`Invalid tokens, ${tokens}`);
    }

    result.push(token);
  }

  return result;
}