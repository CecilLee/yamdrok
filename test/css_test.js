/**
 *
 * 针对css编写测试用例
 *
 */

module.exports = (function(){

    var yamdrok = require('../src/yamdrok');

    var csstext;

    return {
        basic_ruleset: function(test){
            csstext = 'div{background:#f00}';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'ruleset',
                    value: 'div{background:#f00}'
                }
            ], selector + ' PASSED');

            test.done();
        }
    };

}());
