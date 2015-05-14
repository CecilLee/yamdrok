/**
 *
 * yamdrok
 *
 *
 */
var yamdrok = (function(){

    var jcon = require('jcon');
    var shorthair = require('shorthair');

    var nonascii = jcon.regex(/[^\0-\177]/).type('nonascii');
    var unicode = jcon.regex(/\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?/).type('unicode');
    var escape = unicode.or(jcon.regex(/\\[^\n\r\f0-9a-f]/)).type('escape');
    var nmchar = jcon.regex(/[_a-z0-9-]/).or(nonascii, escape).type('nmchar');
    var nmstart = jcon.regex(/[_a-z]/).or(nonascii, escape).type('nmstart');
    var ident = jcon.regex(/[-]?/).seq(nmstart, nmchar.many()).type('ident');
    var name = nmchar.least(1).type('name');
    var num = jcon.regex(/[0-9]+|[0-9]*\.[0-9]+/).type('num');
    var nl = jcon.regex(/\n|\r\n|\r|\f/).type('nl');
    var string1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many(), jcon.string('"')).type('string1');
    var string2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many(), jcon.string("'")).type('string2');
    var string = string1.or(string2).type('string');
    var invalid1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many()).type('invalid1');
    var invalid2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many()).type('invalid2');
    var invalid = invalid1.or(invalid2).type('invalid');


    var h = jcon.regex(/[0-9a-f]/);
    var S = jcon.regex(/[ \t\r\n\f]+/);
    var CDO = jcon.regex(/\<\!\-\-/);
    var CDC = jcon.regex(/\-\-\>/);

    var import_sym = jcon.string('@import');
    var page_sym = jcon.string('@page');
    var media_sym = jcon.string('@media');
    var font_face_sym = jcon.string('@font-face');
    var charset_sym = jcon.string('@charset');
    var namespace_sym = jcon.string('@namespace');
    var viewport_sym = jcon.string('@viewport');
    var keyframes_sym = jcon.regex(/@(?:-[a-z]+-)?keyframes/);
    var ident = jcon.regex(/[-]?/).seq(nmstart, nmchar.many()).type('ident');


    var pseudo_page = jcon.seq(jcon.string(':'), ident);


    var space_list = S.many().skip();

    var scd_list = jcon.lazy(function(){
        return jcon.seq(scd_list.possible(), jcon.or(S, CDO, CDC));
    });
    

    /*
      stylesheet
      rule
      declaration
      comment
      charset
      custom-media
      document
      font-face
      host
      import
      keyframes
      keyframe
      media
      namespace
      page
      supports
    */

    var property = jcon.seq(ident, space_list).setAst('property');

    var term = jcon.seq(jcon.or(string, ident), space_list);
    var operator = jcon.seq(jcon.or(jcon.string('/'), jcon.string(',')), space_list);
    var expr = jcon.seq(operator.possible(), term).least(1).setAst('expr');

    var declaration = jcon.seq(property,
        jcon.string(':'),
        space_list,
        expr).setAst('declaration');


    /*
    var declaration_list = jcon.or(declaration,
        jcon.seq(declaration_list, jcon.string(';'), space_list, declaration.possible())).setAst();
        */
    var declaration_list = jcon.or(declaration,
        jcon.seq(declaration, jcon.string(';'))).many();

    var ruleset = jcon.seq(shorthair, jcon.string('{'), space_list, declaration_list.possible(), jcon.string('}'), space_list).setAst('ruleset');

    var entity_list = jcon.or(
        ruleset,
        jcon.seq(entity_list, ruleset));

    var stylesheet = jcon.seq(/*charset.possible(), scd_list.possible(), import_list.possible(), namespace_list.possible(),*/ entity_list.possible()).setAst('stylesheet');



    return stylesheet;

}());

(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }

}('yamdrok', yamdrok));
