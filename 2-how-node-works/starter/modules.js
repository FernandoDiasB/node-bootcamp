// console.log(arguments); 
// console.log(require('module').wrapper);

const C = require('./test-module.js');
const calc = new C();
console.log(calc.add(2, 3));