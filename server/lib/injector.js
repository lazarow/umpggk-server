var di = require('node-di-container'),
    container = require('./container.js');
    
module.exports = di.injector(container);
console.log('The DI injector has been created');
