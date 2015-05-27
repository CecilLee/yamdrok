'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('css number', function(){
    var number = require('../src/token').number;

    number.parse('0').should.to.have.deep.property('value', '0')
    number.parse('10').should.to.have.deep.property('value', '10')
    number.parse('+10').should.to.have.deep.property('value', '+10')
    number.parse('-10').should.to.have.deep.property('value', '-10')
    number.parse('-10.1').should.to.have.deep.property('value', '-10.1')
    number.parse('-.1').should.to.have.deep.property('value', '-.1')
    number.parse('-.1e1').should.to.have.deep.property('value', '-.1e1')
    number.parse('-.1e+1').should.to.have.deep.property('value', '-.1e+1')
    number.parse('-.1e-1').should.to.have.deep.property('value', '-.1e-1')

});
