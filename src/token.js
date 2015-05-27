var token = (function(){
    var jcon = require('jcon');

    var digit = jcon.regex(/[0-9]/);
    var hex_digit = jcon.regex(/[0-9a-fA-F]/);
    var nonascii = jcon.regex(/[^\0-\127]/);
    var newline = jcon.regex(/(?:\r\n|[\r\n\f])/);
    var whitespace = jcon.or(jcon.string(' '),
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
    var escape = jcon.seq(jcon.string('\\'),
        jcon.or(jcon.not(jcon.or(newline, hex_digit)),
            jcon.seq(hex_digit.times(1, 6), whitespace.possible())
        )
    );

    var whitespace_token = whitespace.least(1);

    var ws_opt = whitespace.many();

    var ident_token = jcon.seq(
        jcon.string('-').possible(),
        jcon.or(
            jcon.or(jcon.regex(/[a-zA-Z_]/), nonascii),
            escape
        ),
        jcon.or(
            jcon.or(jcon.regex(/[0-9a-zA-Z_\-]/), nonascii),
            escape
        ).many()
    );

    var function_token = jcon.seq(ident_token, jcon.string('('));

    var at_keyword_token = jcon.seq(jcon.string('@'), ident_token);

    var hash_token = jcon.seq(
        jcon.string('#'),
        jcon.or(
            jcon.or(jcon.regex(/[0-9a-zA-Z_\-]/), nonascii),
            escape
        ).least(1)
    );







    return {
        digit: digit,
        hex_digit: hex_digit,
        comment: comment,
        newline: newline,
        whitespace: whitespace,
        number: number,
        ident_token: ident_token,
        function_token: function_token
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
