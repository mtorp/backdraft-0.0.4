module.exports = function (bdApi) {

    if (bdApi.config.path !== undefined) {
        process.chdir(bdApi.config.path);
    }

    bdApi.process           = bdApi.handler.serverProcess;
    
    var meta                = {source: 'manager:lib/api.js'};

    function log(msg) {
        bdApi.logger.default(msg, {source: 'lib/api.js', function: 'log [DEFAULT LOGGER]'});
    }

    function errorHandler(err, req, res, next) {
        meta.function = 'errorHandler';
        meta.detail = (err.detail) ? err.detail : err.stack;
        bdApi.logger.exception('500 Error', meta);
        bdApi.handler.error(err, req, res, next);
    }

    function notFoundHandler(req, res, next) {
        meta.function = 'notFoundHandler';
        meta.detail = req.url;
        bdApi.logger.error('404 Error', meta);
        bdApi.handler.notFound(req, res, next);
    }

    function shutdown(req, res, next) {
        meta.function = 'shutdown';
        bdApi.logger.exception('Shutting Down', meta);
        bdApi.handler.shutdown(req, res, next);
    }

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

};

