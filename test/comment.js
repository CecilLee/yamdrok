'use strict';

var assert = require('assert');
var chai = require('chai');
var should = chai.should();

describe('css comment', function(){

    var comment = require('../src/token').comment;

    comment.parse('/*asdfl*sdfk*s/asdf*/').should.to.have.deep.property('value', '/*asdfl*sdfk*s/asdf*/'); 

});
