import { Type } from '../const.js';
import TypeNode from './SyntaxTreeNode.js';
import SyntaxTreeNode from './SyntaxTreeNode.js';

export default class SyntaxTree {
  constructor() {
    this.root = new SyntaxTreeRootNode();
  }

  getRoot() {
    return this.root;
  }

  getArrayDepth() {
    return arrayDepthRecursion({ currNode: this.root.getEntryNode(), depth: 0 });
  }

  toString() {
    return this.root.getEntryNode()?.toString();
  }
}

class SyntaxTreeRootNode extends SyntaxTreeNode {
  constructor() {
    super({ type: 'root' });
  }

  getEntryNode() {
    return this.child?.[0];
  }
}

function arrayDepthRecursion({ currNode, depth }) {
  const nextDepth = currNode.getType() === Type.ARRAY ? depth + 1 : depth;
  let resultDepth = depth;

  currNode.getChild()?.forEach(childNode => {
    let tmpDepth = 0;

    if (childNode.getType() === Type.OBJECT_PROPERTY)
      tmpDepth = arrayDepthRecursion({ currNode: childNode.getValue().getPropValue(), depth: nextDepth }) ?? 0;
    
    resultDepth =  Math.max(tmpDepth, resultDepth, arrayDepthRecursion({ currNode: childNode, depth: nextDepth }) ?? 0);
  });

  return resultDepth;
}