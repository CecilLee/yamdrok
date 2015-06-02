
var jcon = require('jcon');
var yamdrok = require('./src/yamdrok');
var fs = require('fs');
var csstext = fs.readFileSync('test.css','utf-8');


//console.log(jcon.regex(/[^\u0000-\u007f]/).parse('你'));

console.log(JSON.stringify(yamdrok.parse(csstext),null,' '));
console.log(JSON.stringify(yamdrok.parse(csstext).ast(),null,' '));


