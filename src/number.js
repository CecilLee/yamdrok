var number = (function(){
    var jcon = require('jcon');
    var digit = jcon.regex(/[0-9]/);
    return jcon.seq(jcon.or(jcon.string('+'), jcon.string('-').possible()),
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
})();
(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }
}('number', number));
