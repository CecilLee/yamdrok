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
    var nmchar = jcon.regex(/[_a-z0-9-]/).or(nonascii, escape).type('nmchar');
    var nmstart = jcon.regex(/[_a-z]/).or(nonascii, escape).type('nmstart');
    var ident = jcon.regex(/[-]?/).seq(nmstart, nmchar.many()).type('ident');
    var name = nmchar.least(1).type('name');
    var escape = unicode.or(jcon.regex(/\\[^\n\r\f0-9a-f]/)).type('escape');
    var num = jcon.regex(/[0-9]+|[0-9]*\.[0-9]+/).type('num');
    var nl = jcon.regex(/\n|\r\n|\r|\f/).type('nl');
    var string1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many(), jcon.string('"')).type('string1');
    var string2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many(), jcon.string("'")).type('string2');
    var string = string1.or(string2).type('string');
    var invalid1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many()).type('invalid1');
    var invalid2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many()).type('invalid2');
    var invalid = invalid1.or(invalid2).type('invalid');


    var h = jcon.regex(/[0-9a-f]/);
    var nonascii = jcon.regex(/[\u0200-\uFFFF]/);

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


    var space_list = jcon.lazy(function(){
        return jcon.seq(space_list.possible(), S);
    });

    var scd_list = jcon.lazy(function(){
        return jcon.seq(scd_list.possible(), jcon.or(S, CDO, CDC));
    });
    
    var namespace_list = jcon.lazy(function(){
        return jcon.seq(namespace_list.possible(), namespace, scd_list.possible());
    });

    var import_list = jcon.lazy(function(){
        return jcon.seq(import_list.possible(), imports, scd_list.possible());
    });

    var entity_list = jcon.lazy(function(){
        return jcon.seq(entity_list.possible(), jcon.or(ruleset, media, page, font_face, viewport, keyframes_rule), scd_list.possible());
    });

    var medium = jcon.seq(ident, space_list.possible());
    var declaration_list = jcon.lazy(function(){
        return jcon.or(
                declaration,
                jcon.seq(delcaration_list.possible(), jcon.string(';'), space_list.possible(), declaration.possible()));
    });

    var uri = jcon.or(jcon.regex(/[!#$%&*-~]/), nonascii, escape).many();

    var medium_list = jcon.lazy(function(){
        return jcon.or(
            medium,
            jcon.seq(medium_list.possible(), jcon.string(','), space_list.possible(), medium)
        );
    });


    var imports = jcon.or(
        jcon.seq(import_sym, space_list.possible(), uri, space_list.possible(), medium_list.possible(), jcon.string(';'), space_list.possible()),
        jcon.seq(import_sym, space_list.possible(), string, space_list.possible(), medium_list.possible(), jcon.string(';'), space_list.possible())
    );

    var namespace = jcon.seq(namespace_sym, space_list.possible(), jcon.seq(namespace_prefix, space_list.possible()).possible(), jcon.or(string, uri), space_list.possible(), jcon.string(';'), space_list.possible());

    var namespace_prefix = ident;


    var kyeframes_selector = jcon.lazy(function(){
        return jcon.seq( jcon.or(from_sym, to_sym, percentage), space_list.possible() );
    });

    var keyframes_blocks = jcon.lazy(function(){
        return jcon.seq(keyframes_blocks.possible(), keyframe_selector, jcon.string('{'), space_list.possible(), declaration_list, jcon.string('}'), space_list.possible());
    });

    var charset = jcon.seq(charset_sym, space_list.possible(), string, space_list.possible(), jcon.string(';'));


    var font_face = jcon.seq(font_face_sym, space_list.possible(), jcon.string('{'), space_list.possible(), declaration_list.possible(), jcon.string('}'), space_list.possible());
    var keyframes_rule = jcon.seq(
        keyframes_sym,
        space_list,
        ident,
        space_list.possible(),
        jcon.string('{'),
        space_list.possible(),
        keyframes_blocks,
        jcon.string('}'),
        space_list.possible()
    );

    var viewport = jcon.seq(viewport_sym, space_list.possible(), jcon.string('{'), space_list.possible(), declaration_list.possible(), jcon.string('}'), space_list.possible());

    var ruleset_list = jcon.lazy(function(){
        return jcon.seq(ruleset_list.possible, ruleset);
    });

    var media_query_list = jcon.lazy(function(){
        return jcon.or(
            jcon.seq(media_query_list, jcon.string(','), space_list.possible(), media_query),
            media_query
        );
    });


    var media_type = ident;

    var media_query = jcon.lazy(function(){
        return jcon.or(
            jcon.seq(jcon.or(only_sym, not_sym).possible(), space_list.possible(), media_type, space_list.possible()),
            media_expression,
            jcon.seq(media_query, and_sym, space_list.possible(), media_expression)
        );
    });

    var ruleset_or_viewport_list = jcon.lazy(function(){
        return jcon.seq(ruleset_or_viewport_list.possible(), jcon.or(ruleset, viewport));
    });

    var media = jcon.seq(media_sym, space_list.possible(), media_query_list.possible(), jcon.string('{'), space_list.possible(), ruleset_or_viewport_list.possible(), jcon.string('}'), space_list.possible());

    var media_expression = jcon.seq(jcon.string('('), space_list.possible(), media_feature, space_list.possible(), jcon.seq(jcon.string(':'), space_list.possible()/*, expr*/).possible(), jcon.string(')'), space_list.possible());

    var media_feature = ident;

    var page = jcon.seq(page_sym, space_list.possible(), ident.possible(), pseudo_page.possible(), space_list.possible(), jcon.string('{'), space_list.possible(), declaration_list.possible(), jcon.string('}'), space_list.possible());


    var stylesheet = jcon.seq(charset.possible(), scd_list.possible(), import_list.possible(), namespace_list.possible(), entity_list.possible());



    var ruleset = jcon.seq(shorthair, jcon.string('{'), space_list.possible(), declaration_list.possible(), jcon.string('}'), space_list.possible());

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
