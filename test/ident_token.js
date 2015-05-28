
var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('css ident', function(){

    var ident = require('../src/token').ident;

    ident.parse('-aA0_-\\3A').should.to.have.deep.property('value', '-aA0_-\\3A'); 

});
