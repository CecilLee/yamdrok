/**
 *
 * yamdrok
 *
 * http://www.w3.org/TR/css-syntax-3/
 *
 *
 */
var yamdrok = (function(){

    var jcon = require('jcon');
    var shorthair = require('shorthair');

    var epsilon = jcon.string('');

    var comment = require('./comment');
    var number = require('./number');
    var whitespace = require('./whitespace');
    var newline = require('./newline');

    var digit = jcon.regex(/[0-9]/);




    var nonascii = jcon.regex(/[^\0-\177]/).type('nonascii');
    var space = jcon.regex(/[ \t\r\n\f]/);      //\s还多包含一个垂直制表符\v
    var space_list = jcon.regex(/[ \t\r\n\f]+/);      //\s还多包含一个垂直制表符\v
    var skips = jcon.regex(/[ \t\r\n\f]*/).skip();  //不合并到解析结果，要忽略掉的可选空白符
    var unicode = jcon.regex(/\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?/).type('unicode');
    var escape = unicode.or(jcon.regex(/\\[^\n\r\f0-9a-f]/)).type('escape');
    var nmchar = jcon.regex(/[_a-z0-9-]/).or(nonascii, escape).type('nmchar');
    var nmstart = jcon.regex(/[_a-z]/).or(nonascii, escape).type('nmstart');
    var ident = jcon.regex(/[-]?/).seq(nmstart, nmchar.many()).type('ident');
    var name = nmchar.least(1).type('name');

    //因为js的正则中的或运算，并不会返回最长匹配结果，而是依据短路模式
    //所以没有使用 var num = jcon.regex(/[0-9]+|[0-9]*\.[0-9]+/);
    //var num = jcon.or(jcon.regex(/[0-9]+/), jcon.regex(/[0-9]*\.[0-9]+/));
    //
    //
    var nl = jcon.regex(/\n|\r\n|\r|\f/).type('nl');
    var string1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many(), jcon.string('"')).type('string1');
    var string2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many(), jcon.string("'")).type('string2');
    var string = string1.or(string2).type('string');
    var invalid1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many()).type('invalid1');
    var invalid2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many()).type('invalid2');
    var invalid = invalid1.or(invalid2).type('invalid');
    var hash = jcon.string('#');
    var colon = jcon.string(':');
    var semicolon = jcon.string(';');
    var hexcolor = jcon.seq(hash, nmchar.least(1));
    var url = jcon.or(jcon.regex(/[!#$%&*-~]/), nonascii, escape).many();
    var uri = jcon.seq(jcon.string('url('), skips, jcon.or(string1, string2, url), skips, jcon.string(')'));
    var resolution = jcon.seq(number, jcon.regex(/dpi|dpcm/));
    var dimension = jcon.seq(number, ident);
    var percentage = jcon.seq(number, jcon.string('%'));
    var unary_operator = jcon.regex(/[\+\-]/);
    var length = jcon.seq(number, jcon.regex(/(px|cm|mm|in|pt|pc)/));
    var ems = jcon.seq(number, jcon.regex(/(em|rem)/));
    var exs = jcon.seq(number, jcon.string('ex'));
    var angle = jcon.seq(number, jcon.regex(/(deg|rad|grad)/));
    var time = jcon.seq(number, jcon.regex(/(s|ms)/));
    var freq = jcon.seq(number, jcon.regex(/Hz|kHz/));


    var unit = jcon.or(number, dimension, percentage).setAst('unit');

    var product = jcon.lazy(function(){
        return jcon.or(unit,
                jcon.seq(unit, product_rest).setAst('product'));
    });
    var product_operator = jcon.regex(/[\*\/]/).setAst('operator');
    var product_rest = jcon.or(epsilon, jcon.seq(skips, product_operator, skips, product));

    var sum = jcon.lazy(function(){
        return jcon.or(product, 
                jcon.seq(product, sum_rest).setAst('sum'));
    });
    var sum_operator = jcon.regex(/[\+\-]/).setAst('operator');
    var sum_rest = jcon.or(epsilon, jcon.seq(skips, sum_operator, skips, sum));

    var calc = jcon.seq(jcon.string('calc('), skips, sum, skips, jcon.string(')')).setAst('calc');
    var math = jcon.seq(calc, skips);


    var h = jcon.regex(/[0-9a-f]/);
    var comment_open = jcon.regex(/\<\!\-\-/);
    var comment_close = jcon.regex(/\-\-\>/);

    var import_sym = jcon.string('@import');
    var page_sym = jcon.string('@page');
    var media_sym = jcon.string('@media');
    var font_face_sym = jcon.string('@font-face');
    var charset_sym = jcon.string('@charset');
    var namespace_sym = jcon.string('@namespace');
    var viewport_sym = jcon.string('@viewport');
    var keyframes_sym = jcon.regex(/@(?:-[a-z]+-)?keyframes/);
    var ident = jcon.regex(/[-]?/).seq(nmstart, nmchar.many()).type('ident');


    var pseudo_page = jcon.seq(colon, ident);



    var scd_list = jcon.lazy(function(){
        return jcon.seq(scd_list.possible(), jcon.or(space, comment_open, comment_close));
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

    var property = jcon.seq(ident, skips).setAst('property');

    var term = jcon.seq(unary_operator.possible(),
        jcon.or(percentage,
            number,
            length,
            exs,
            ems,
            angle,
            time,
            freq,
            string,
            ident,
            uri,
            resolution,
            math,
            hexcolor
        ));

    var operator = jcon.seq(jcon.or(jcon.string('/'), jcon.string(',')), skips);

    var expr = jcon.lazy(function(){
        return jcon.or(term, jcon.seq(term, expr_rest)).setAst('expr');
    });
    var expr_rest = jcon.or(epsilon, jcon.seq(operator, expr));

    var expr_list = jcon.seq(jcon.or(expr, jcon.seq(expr, jcon.regex(/[ \t\f]/))), skips).least(1).setAst('expr_list');

    var declaration = jcon.seq(property,
        colon,
        skips,
        expr_list).setAst('declaration');

    var declaration_list = jcon.or(declaration.lookhead(jcon.string('}')),
        jcon.seq(declaration, semicolon, skips)).many().setAst('declaration_list');

    var ruleset = jcon.seq(shorthair.setAst('selectors'), jcon.string('{'), skips, declaration_list.possible(), jcon.string('}'), skips).setAst('ruleset');

    var entity_list = jcon.or(ruleset).many()


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
