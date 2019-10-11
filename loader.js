var Loader = function Loader(config) {
    var server            = {};

    server.config         = config;
    server.express        = require('express');
		server.cors						= require('cors');
    server.mongoose       = require('mongoose');
    server.path           = require('path');
    server.MongoStore     = require('connect-mongo')(server.express);
    server.http           = require('http');

    server.app            = server.express();
    server.lang           = require('./lang/' + config.app.lang);
    server.logger         = require('./lib/log')(server);
    server.log            = server.logger.log;

    server.db             = require('./lib/db')(server);
    server.handler        = require('./lib/handler')(server);
    server.auth           = require('./lib/auth')(server);
    server.security       = require('./lib/security')(server);
    server.response       = require('./lib/response')(server);
    server.submodule      = require('./lib/submodule')(server);
    server.model          = require('./baseline/model')(server);
    server.view           = require('./baseline/view')(server);
    server.controller     = require('./baseline/controller')(server);

    server.api            = require('./lib/api')(server);

    this.prototype        = server;
};

module.exports = function (config) {
    var loader = new Loader(config);
    return loader.prototype;
};
