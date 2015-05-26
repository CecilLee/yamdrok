var whitespace = (function(){
    var jcon = require('jcon');
    var newline = require('./newline');
    return jcon.or(jcon.string(' '),
            jcon.string('\t'),
            newline);
})();
(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }
}('whitespace', whitespace));
