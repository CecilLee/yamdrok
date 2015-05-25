'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();
var jcon = require('jcon');

describe('css newline', function(){

    var newline = jcon.regex(/(?:\r\n|[\r\n\f])/);

    newline.parse('\r').should.to.have.deep.property('value', '\r'); 
    newline.parse('\n').should.to.have.deep.property('value', '\n'); 
    newline.parse('\r\n').should.to.have.deep.property('value', '\r\n'); 
    newline.parse('\f').should.to.have.deep.property('value', '\f'); 

});
