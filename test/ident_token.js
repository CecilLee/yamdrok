
var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('css ident_token', function(){

    var ident_token = require('../src/token').ident_token;

    ident_token.parse('-aA0_-\\3A').should.to.have.deep.property('value', '-aA0_-\\3A'); 

});
