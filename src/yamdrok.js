/**
 *
 * yamdrok
 *
 *
 * http://www.w3.org/TR/css-syntax-3/
 *
 */
var yamdrok = (function(){

    var jcon = require('jcon');
    var shorthair = require('shorthair');

    var epsilon = jcon.string('');

    var token = require('./token');

    var digit = token.digit;
    var hex_digit = token.hex_digit;
    var comment = token.comment;
    var newline = token.newline;
    var whitespace = token.whitespace;
    var ws_opt = token.ws_opt;
    var number = token.number;
    var ident = token.ident;
    var function_token = token.function_token;
    var at_keyword = token.at_keyword;
    var hash = token.hash;
    var string = token.string;
    var url = token.url;
    var dimension = token.dimension;
    var percentage = token.percentage;
    var unicode_range = token.unicode_range;
    var include_match = token.include_match;
    var dash_match = token.dash_match;
    var prefix_match = token.prefix_match;
    var suffix_match = token.suffix_match;
    var substring_match = token.substring_match;
    var column = token.column;
    var CDO = token.CDO;
    var CDC = token.CDC;


    var preserved_token = jcon.or(
        ident,
        function_token,
        at_keyword,
        hash,
        string,
        //bad_string,
        url,
        //bad_url,
        //delim,
        number,
        percentage,
        dimension,
        unicode_range,
        include_match,
        dash_match,
        prefix_match,
        suffix_match,
        substring_match,
        column,
        whitespace,
        CDO,
        CDC,
        jcon.string(':'),
        jcon.string(';'),
        jcon.string(',')
    );

    var component_value = jcon.or(
        preserved_token,
        brace_block,
        bracket_block,
        paren_block,
        function_block
    );

    var function_block = jcon.seq(
        function_token,
        component_value.many(),
        jcon.string(')')
    );

    var paren_block = jcon.seq(
        jcon.string('('),
        component_value.many(),
        jcon.string(')')
    );

    var bracket_block = jcon.seq(
        jcon.string('['),
        component_value.many(),
        jcon.string(']')
    );

    var brace_block = jcon.seq(
        jcon.string('{'),
        component_value.many(),
        jcon.string('}')
    ).setAst('brace_block');


    var important = jcon.seq(
        jcon.string('!'),
        ws_opt,
        jcon.string('important'),
        ws_opt
    );

    var declaration = jcon.seq(
        ident,
        ws_opt,
        jcon.string(':'),
        component_value.many(),
        important.possible()
    );

    var declaration_list = jcon.seq(
        ws_opt,
        jcon.or(
            jcon.seq(
                declaration.possible(), 
                jcon.seq(
                    jcon.string(';'),
                    declaration_list
                ).possible()
            ),
            jcon.seq(
                at_rule,
                declaration_list
            )
        )
    ).setAst('declaration_list');


    var rule_list = jcon.or(
        whitespace,
        qualified_rule,
        at_rule
    ).many();

    var qualified_rule = jcon.seq(
        component_value.many().setAst('selectors'),
        brace_block
    );
    var at_rule = jcon.seq(
        at_keyword,
        component_value.many(),
        jcon.or(
            brace_block,
            jcon.string(';')
        )
    );


    var stylesheet = jcon.or(
        CDO,
        CDC,
        whitespace,
        qualified_rule,
        at_rule
    ).many();

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
