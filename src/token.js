var token = (function(){
    var jcon = require('jcon');

    var digit = jcon.regex(/[0-9]/);
    var hex_digit = jcon.regex(/[0-9a-fA-F]/);
    var non_ascii = jcon.regex(/[^\u0000-\u007f]/).type('non-ascii');
    var non_printable = jcon.regex(/(?:[\u0000-\u0008]|[\u000b]|[\u000e-\u001f]|[\u007f])/);
    var newline = jcon.regex(/(?:\r\n|[\r\n\f])/);
    var whitespace_chr = jcon.or(jcon.string(' '),
        jcon.string('\t'),
        newline
    );

    var comment = jcon.seq(jcon.string('/*'),
        jcon.or(jcon.noInStr('*'), jcon.string('*').noLookhead(jcon.string('/'))).many(),
        jcon.string('*/')
    );
    
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

    var whitespace = whitespace_chr.least(1);

    var ws_opt = whitespace_chr.many();

    var escape = jcon.seq(jcon.string('\\'),
        jcon.or(jcon.not(jcon.or(newline, hex_digit)),
            jcon.seq(hex_digit.times(1, 6), whitespace.possible())
        )
    ).type('escape');



    var ident = jcon.seq(
        jcon.string('-').possible(),
        jcon.or(
            jcon.or(jcon.regex(/[a-zA-Z_]/), non_ascii),
            escape
        ),
        jcon.or(
            jcon.or(jcon.regex(/[0-9a-zA-Z_\-]/), non_ascii),
            escape
        ).many()
    ).type('ident');

    var function_token = jcon.seq(ident, jcon.string('(')).type('function_token');

    var at_keyword = jcon.seq(jcon.string('@'), ident).type('at_keyword');

    var hash = jcon.seq(
        jcon.string('#'),
        jcon.or(
            jcon.or(jcon.regex(/[0-9a-zA-Z_\-]/), non_ascii),
            escape
        ).least(1)
    );

    var string = jcon.or(
        jcon.seq(
            jcon.string('"'),
            jcon.or(
                jcon.or(jcon.string('"'), jcon.string('\\'), newline).not(),
                escape,
                jcon.seq(jcon.string('\\'), newline)
            ).many(),
            jcon.string('"')
        ),
        jcon.seq(
            jcon.string("'"),
            jcon.or(
                jcon.or(jcon.string("'"), jcon.string('\\'), newline).not(),
                escape,
                jcon.seq(jcon.string('\\'), newline)
            ).many(),
            jcon.string("'")
        )
    );

    var url_unquoted = jcon.or(
        jcon.or(
            jcon.string('"'),
            jcon.string("'"),
            jcon.string("("),
            jcon.string(")"),
            jcon.string("\\"),
            whitespace,
            non_printable
        ).not(),
        escape
    ).many();

    var url = jcon.seq(
        ident,
        jcon.string('url('),
        ws_opt,
        jcon.seq(
            jcon.or(
                url_unquoted,
                string
            ),
            ws_opt
        ).possible(),
        jcon.string(')')
    );



    var dimension = jcon.seq(number, ident);


    var percentage = jcon.seq(number, jcon.string('%'));


    var unicode_range = jcon.seq(
        jcon.or(
            jcon.string('U'),
            jcon.string('u')
        ),
        jcon.string('+'),
        jcon.or(
            hex_digit.times(1,6),
            //这里有U+333???的模式目前jcon不支持
            jcon.seq(
                hex_digit.times(1, 6),
                jcon.string('-'),
                hex_digit.times(1, 6)
            )
        )
    );

    var include_match = jcon.string('~=');

    var dash_match = jcon.string('|=');

    var prefix_match = jcon.string('^=');

    var suffix_match = jcon.string('$=');

    var substring_match = jcon.string('*=');

    var column = jcon.string('||');

    var CDO = jcon.string('<!--');

    var CDC = jcon.string('-->');



    return {
        digit: digit,
        hex_digit: hex_digit,
        comment: comment,
        newline: newline,
        whitespace: whitespace,
        number: number,
        ident: ident,
        function_token: function_token,
        at_keyword: at_keyword,
        hash: hash,
        string: string,
        url: url,
        dimension: dimension,
        percentage: percentage,
        unicode_range: unicode_range,
        include_match: include_match,
        dash_match: dash_match,
        prefix_match: prefix_match,
        suffix_match: suffix_match,
        substring_match: substring_match,
        column: column,
        CDO: CDO,
        CDC: CDC
    };

})();
(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }
}('token', token));
