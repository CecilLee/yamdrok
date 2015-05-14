/**
 *
 * 针对css编写测试用例
 *
 */

'use strict';

var should = require('should');
var yamdrok = require('../src/yamdrok');
var assert = require('assert');

var csstext;

describe('simple cssrule', function(){
        csstext = 'div{background:red}';

        console.log(yamdrok.parse(csstext).ast());
        assert.deepEqual(yamdrok.parse(csstext).ast(), {
        }, csstext);

});
