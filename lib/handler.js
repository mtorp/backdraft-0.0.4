var meta = {source: 'lib/handler.js'};

var fs        = require('fs')
    , util    = require('util')
    , events  = require('events');

var AppHandler = function AppHandler(api) {
    events.EventEmitter.call(this);

    var serverProcess = {};

    var _handleProcess = function handleProcess(process) {
        serverProcess = process;
    };

    var _handleError = function handleError(err, req, res, next) {
        meta                    = {};
        meta.source     = 'lib/handler.js';
        meta.function = 'handleError';
        meta.detail   = (err.detail) ? err.detail : err.stack;

        var errorResponse = {
            code: (err.status) ? err.status : (err.code) ? err.code : 500,
            error: (err.error) ? err.error : 'Internal Server Error',
						type: (err.type) ? err.type : '',
            reason: (err.reason) ? err.reason : 'The application encountered an unknown error.'
        };

        if (res !== undefined) {
            res.statusCode = errorResponse.code;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(errorResponse));
        }
    };

    var _handleNotFound = function handleNotFound(req, res, next) {
        _handleError({ code: 404, error: 'Not Found', reason: 'Page not found.' }, req, res);
    };

    var _shutdown = function shutdown() {
        meta = {};
        meta.source = 'lib/handler.js';
        meta.function = 'handleShutdown';

        serverProcess.close();
        setTimeout(function () {
            process.exit();
        }, 5000);
    };

    var _response = function response(req, res, payload) {
        meta.function = '_response';
				api.logger.debug('Sending Response', meta);

				//payload.viaHandler = true;

				var strResponse = JSON.stringify(payload) || {};

        console.log('** PAYLOAD: ' + strResponse);
				if (payload.code) {
					if (payload.code === 401) res.setHeader('WWW-Authenticate', 'FORM');

					res.send(payload.code, strResponse);
				} else {
					res.send(200, strResponse);
				}
    };

    this.on('handleProcess', _handleProcess);
    this.on('handleError', _handleError);
    this.on('handleNotFound', _handleNotFound);
    this.on('handleShutdown', _shutdown);
    this.on('handleResponse', _response);
};

var Plugin = function Plugin(api) {
    util.inherits(AppHandler, events.EventEmitter);
    var handler = new AppHandler(api);

    this.prototype = {
        serverProcess: function serverProcess(process) {
					meta.function = 'serverProcess:emitter';
					api.logger.debug('Emitting', meta);
					
            handler.emit('handleProcess', process);
        },

        error: function error(err, req, res, next) {
					meta.function = 'error:emitter';
					api.logger.debug('Emitting', meta);
					
            handler.emit('handleError', err, req, res, next);
        },

        notFound: function notFound(req, res, next) {
					meta.function = 'notFound:emitter';
					api.logger.debug('Emitting', meta);
					
            handler.emit('handleNotFound', req, res, next);
        },

        shutdown: function shutdown() {
					meta.function = 'shutdown:emitter';
					api.logger.debug('Emitting', meta);
					
            handler.emit('handleShutdown');
        },

        response: function response(req, res, payload) {
					meta.function = 'response:emitter';
					api.logger.debug('Emitting', meta);
					
          handler.emit('handleResponse', req, res, payload);
        }
    };
};


module.exports = function (bdApi) {
	meta.function = 'exports';
	bdApi.logger.debug('Exporting Handler', meta);
	
	var plugin = new Plugin(bdApi);
	return plugin.prototype;
};
