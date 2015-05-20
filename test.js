

var yamdrok = require('./src/yamdrok');
var fs = require('fs');
var csstext = fs.readFileSync('test.css','utf-8');
console.log(JSON.stringify(yamdrok.parse(csstext).ast(),null,' '));



