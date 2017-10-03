var di = require('node-di-container'),
    container = require('./container.js');

module.exports = di.injector(container);
