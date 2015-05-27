var token = (function(){
    var jcon = require('jcon');

    var digit = jcon.regex(/[0-9]/);
    var hex_digit = jcon.regex(/[0-9a-fA-F]/);
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


    return {
        digit: digit,
        hex_digit: hex_digit,
        comment: comment,
        newline: newline,
        whitespace: whitespace,
        number: number
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
