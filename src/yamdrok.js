/**
 *
 * yamdrok
 *
 *
 */
var yamdrok = (function(){

    var jcon = require('jcon');
    var shorthair = require('shorthair');

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


    var stylesheet = jcon.seq(charset.possible(), scd_list.possible(), import_list.possible(), namespace_list.possible(), entity_list.possible());

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
        return jcon.seq(import_list.possible(), import, scd_list.possible());
    });

    var entity_list = jcon.lazy(function(){
        return jcon.seq(entity_list.possible(), jcon.or(ruleset, media, page, font_face, viewport, keyframes_rule), scd_list.possible());
    });

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

    var kyeframes_selector = jcon.lazy(function(){
        return jcon.seq( jcon.or(from_sym, to_sym, percentage), space_list.possible() );
    });

    var keyframes_block = jcon.lazy(function(){
        return jcon.seq(keyframes_blocks.possible(), keyframe_selector, jcon.string('{'), space_list.possible(), declaration_list, jcon.string('}'), space_list.possible());
    });

    var charset = jcon.seq(charset_sym, space_list.possible(), string, space_list.possible(), jcon.string(';'));

    var medium_list = jcon.lazy(function(){
        return jcon.or(
            medium,
            jcon.seq(medium_list.possible(), jcon.string(','), space_list.possible(), medium)
        );
    });

    var import = jcon.or(
        jcon.seq(import_sym, space_list.possible(), uri, space_list.possible(), medium_list.possible(), jcon.string(';'), space_list.possible()),
        jcon.seq(import_sym, space_list.possible(), string, space_list.possible(), medium_list.possible(), jcon.string(';'), space_list.possible())
    );



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
