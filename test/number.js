'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();
var jcon = require('jcon');

describe('css number', function(){
    var digit = jcon.regex(/[0-9]/);
    var number = jcon.seq(jcon.or(jcon.string('+'), jcon.string('-').possible()),
            jcon.or(
                jcon.seq(digit.least(1), jcon.string('.'), digit.least(1)),
                digit.least(1),
                jcon.seq(jcon.string('.'), digit.least(1))
            ),
            jcon.seq(jcon.or(jcon.string('e'), jcon.string('E')),
                jcon.or(jcon.string('+'), jcon.string('-')).possible(),
                digit.least(1)
            ).possible()
    );

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
