var comment = (function(){
    var jcon = require('jcon');
    return jcon.seq(jcon.string('/*'),
        jcon.or(jcon.noInStr('*'), jcon.string('*').noLookhead(jcon.string('/'))).many(),
        jcon.string('*/'));

})();
(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }
}('comment', comment));
