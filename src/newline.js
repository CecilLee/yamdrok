var newline = (function(){
    var jcon = require('jcon');
    return jcon.regex(/(?:\r\n|[\r\n\f])/);
})();
(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }
}('newline', newline));
