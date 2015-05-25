'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();
var jcon = require('jcon');

describe('css comment', function(){
    var comment = jcon.seq(jcon.string('/*'),
                    jcon.or(jcon.noInStr('*'), jcon.string('*').noLookhead(jcon.string('/'))).many(),
                    jcon.string('*/'));

    comment.parse('/*asdfl*sdfk*s/asdf*/').should.to.have.deep.property('value', '/*asdfl*sdfk*s/asdf*/'); 

});
