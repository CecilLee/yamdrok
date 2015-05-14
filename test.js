
    var yamdrok = require('./src/yamdrok');
    var csstext = 'body{background:red;background:green;background:yellow}';
    console.log(JSON.stringify(yamdrok.parse(csstext).ast(),null,' '));
