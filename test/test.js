/**
 *
 * 针对css编写测试用例
 *
 */

'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();
var yamdrok = require('../src/yamdrok');

chai.config.showDiff = true;

describe('css syntax', function(){

    describe('declaration', function(){
        var csstext = 'div{background:#fff}';
        var ast = yamdrok.parse(csstext).ast();

        /*[
            {
                "type": "stylesheet",
                "value": "div{background:red}",
                "childs": [
                    {
                        "type": "ruleset",
                        "value": "div{background:red}",
                        "childs": [
                            {
                                "type": "selectors",
                                "value": "div",
                                "childs": [
                                    {
                                        "type": "element_name",
                                        "value": "div"
                                    }
                                ]
                            },
                            {
                                "type": "declaration",
                                "value": "background:red",
                                "childs": [
                                    {
                                        "type": "property",
                                        "value": "background"
                                    },
                                    {
                                        "type": "expr",
                                        "value": "green"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];*/

        ast.should.to.have.deep.property('[0].type','stylesheet');

        ast.should.to.have.deep.property('[0].childs[0].type','ruleset');

        ast.should.to.have.deep.property('[0].childs[0].childs[0].type','selectors');
        ast.should.to.have.deep.property('[0].childs[0].childs[0].value','div');

        ast.should.to.have.deep.property('[0].childs[0].childs[1].type','declaration_list');
        ast.should.to.have.deep.property('[0].childs[0].childs[1].value','background:#fff');

        ast.should.to.have.deep.property('[0].childs[0].childs[1].childs[0].type','declaration');
        ast.should.to.have.deep.property('[0].childs[0].childs[1].childs[0].value','background:#fff');

        ast.should.to.have.deep.property('[0].childs[0].childs[1].childs[0].childs[0].type','property');
        ast.should.to.have.deep.property('[0].childs[0].childs[1].childs[0].childs[0].value','background');

        ast.should.to.have.deep.property('[0].childs[0].childs[1].childs[0].childs[1].type','expr');
        ast.should.to.have.deep.property('[0].childs[0].childs[1].childs[0].childs[1].value','#fff');


    });


    describe('import', function(){
    });


});
