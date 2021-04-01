import { Type } from '../const.js';
import TypeNode from './SyntaxTreeNode.js';
import SyntaxTreeNode from './SyntaxTreeNode.js';

export default class SyntaxTree {
  constructor() {
    this.root = new SyntaxTreeRootNode();
    // this.arrayDepth = 0;
  }

  getRoot() {
    return this.root;
  }

  getArrayDepth() {
    console.log(calArrayDepth(this.root.child, this.arrayDepth));
  }

  toString() {
    return this.root.toString();
  }
}

function calArrayDepth(curNode, arrayDepth=0) {
  // console.log(curNode);
  curNode.forEach((el) => {
    if(el.type === "array") {
      console.log("ho");
      calArrayDepth(el, arrayDepth++);}

    else return arrayDepth;
  })
  // if(curNode.type === "array") calArrayDepth(curNode.child)
}




class SyntaxTreeRootNode extends SyntaxTreeNode{
  constructor() {
    super({ type: 'root'});
  }
}