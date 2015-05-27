'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('css newline', function(){

    var newline = require('../src/token').newline;

    newline.parse('\r').should.to.have.deep.property('value', '\r'); 
    newline.parse('\n').should.to.have.deep.property('value', '\n'); 
    newline.parse('\r\n').should.to.have.deep.property('value', '\r\n'); 
    newline.parse('\f').should.to.have.deep.property('value', '\f'); 

});
