import '../scss/main.scss';
import tokenizer from './tokenizer.js';
import { lexer } from './lexer.js';
import { parse } from './parser.js';
import { _ } from './utils/selctor.js';

function getTreeData() {
  const inputData = _.$('.left__data');
  const print = _.$(".right__result__tree");
  const data = inputData.value;
  const tokens = tokenizer(data);
  const lexerTokens = lexer(tokens);
  const parseResult = parse(lexerTokens);
  const syntaxTree = parseResult.syntaxTree;
  const arrayDepth = parseResult.arrayDepth;
  const numCount = parseResult.numCount;
  const strCount = parseResult.strCount;
  console.log(arrayDepth,numCount,strCount); 
  const result = 'syntaxTree:' + JSON.stringify(syntaxTree, null, '  ');
  print.innerText = result;
  return {syntaxTree, arrayDepth, numCount, strCount};
}

function analysis() {
  const data = getTreeData();
  const resultDiv = _.$(".right__result__analysis");
  resultDiv.innerText = `
  배열 깊이: ${data.arrayDepth}
  문자열 타입 갯수: ${data.strCount}
  숫자 타입 갯수: ${data.numCount}
  `
}


function load() {
  const submitBtn = _.$('.left__btn');
  submitBtn.addEventListener('click', analysis);
}
_.on(window, 'DOMContentLoaded', load);



/*  test cases

  '["1 2 3", 23, true, null, {"key":[false]}, "234ho"]'
  '["1 2, 3", 23, true, null, {"key":3.214}, [{"key1":false,"key2": 2.234},{"key3":23}], "234h,o"]'
  '["1a3", [null, false, ["11", [112233],{"easy" : ["hello", {"a":"a"}, "world"]}, 112], 55, "99"],{"a":"str", "b":[912, [5636,33], {"key":"innervalue", "newkeys":[1,2,3,4,5]}]}, true, false, "true", "false"]'
  '{"a":"str","b":[912, [5656, 33],{"key" : "innervalue","newkeys": [1,2,3,4,5]}]}'


*/