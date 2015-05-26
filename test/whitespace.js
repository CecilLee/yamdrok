'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('css whitespace', function(){

    var whitespace = require('../src/whitespace');

    whitespace.parse('\r').should.to.have.deep.property('value', '\r'); 
    whitespace.parse('\n').should.to.have.deep.property('value', '\n'); 
    whitespace.parse('\r\n').should.to.have.deep.property('value', '\r\n'); 
    whitespace.parse('\f').should.to.have.deep.property('value', '\f'); 
    whitespace.parse(' ').should.to.have.deep.property('value', ' '); 
    whitespace.parse('\t').should.to.have.deep.property('value', '\t'); 


});
