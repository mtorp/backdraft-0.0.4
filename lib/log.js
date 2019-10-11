var meta = {source: 'lib/log.js'};

var  fs                 = require('fs')
        , util          = require('util')
        , Logger        = require('log')
        , events        = require('events')
        , logFiles  = [];

var AppLogger = function AppLogger(bdApi) {
    events.EventEmitter.call(this);

    this.prototype = {

        init: function () {
            if (!this.initialized()) {
                var currentTime = new Date();
                var timestamp = currentTime.getFullYear() + '-' +
                        ('0' + (currentTime.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + currentTime.getDate()).slice(-2) + '-' +
                        ('0' + currentTime.getHours()).slice(-2) +
                        ('0' + currentTime.getMinutes()).slice(-2) +
                        ('0' + currentTime.getSeconds()).slice(-2);

                bdApi.config.logs.levels.forEach(function (item) {
                    if (item.enabled) {
                        var logFileName = item.filePath + '/' + bdApi.config.logs.prefix + '.' + timestamp + '.' + item.name + '.log';
                        logFiles[item.name] = new Logger(item.name, fs.createWriteStream(logFileName));
                    }
                });

                switch (bdApi.config.logs.consoleLevel.toUpperCase()) {
                    case '-1':
                    case 'SILENT':
                        this.consoleLog = new Logger('EMERGENCY', fs.createWriteStream('/dev/null'));
                        break;

                    case '0':
                    case 'DEBUG':
                        this.consoleLog = new Logger('DEBUG', process.stdout);
                        break;

                    case '1':
                    case 'INFO':
                        this.consoleLog = new Logger('INFO', process.stdout);
                        break;

                    case '2':
                    case 'ERROR':
                        this.consoleLog = new Logger('ERROR', process.stdout);
                        break;

                    case '3':
                    case 'SECURITY':
                        this.consoleLog = new Logger('CRITICAL', process.stdout);
                        break;

                    case '4':
                    case 'EXCEPTION':
                        this.consoleLog = new Logger('EMERGENCY', process.stdout);
                        break;

                    case '5':
                    case 'AUDIT':
                        this.consoleLog = new Logger('NOTICE', process.stdout);
                        break;

                    default:
                        this.consoleLog = new Logger('INFO', process.stdout);
                }

                this.initializedFlag = true;
            }
        },

        initialized: function () {
            return (this.initializedFlag === true) ? true : false;
        },

        exception: function (msg) {
            // send all logs to debug and console logs
            logFiles['debug'].emergency('EXCEPTION ' + msg);
            logFiles['info'].emergency('EXCEPTION ' + msg);
            logFiles['error'].emergency('EXCEPTION ' + msg);
            logFiles['exception'].emergency('EXCEPTION ' + msg);
            this.consoleLog.emergency('EXCEPTION ' + msg);
        },

        security: function (msg) {
            // send all logs to debug and console logs
            logFiles['debug'].critical('SECURITY ' + msg);
            logFiles['info'].critical('SECURITY ' + msg);
            logFiles['error'].critical('SECURITY ' + msg);
            this.consoleLog.critical('SECURITY ' + msg);
        },

        error: function (msg) {
            // send all logs to debug and console logs
            logFiles['debug'].error(msg);
            logFiles['info'].error(msg);
            logFiles['error'].error(msg);
            this.consoleLog.error(msg);
        },


        audit: function (msg) {
            // send all logs to debug and console logs
            logFiles['debug'].notice('AUDIT ' + msg);
            logFiles['info'].notice('AUDIT ' + msg);
            this.consoleLog.debug('AUDIT ' + msg);
        },


        info: function (msg) {
            // send all logs to debug and console logs
            logFiles['debug'].info(msg);
            logFiles['info'].info(msg);
            this.consoleLog.debug(msg);
        },

        debug: function (msg) {
            // send all logs to debug and console logs
            logFiles['debug'].debug(msg);
            this.consoleLog.debug(msg);
        },
        /**
         *  The console method doesn't get sent to any other logwriters.
         */
        console: function (msg) {
            this.consoleLog.info(msg);
        }
    };

    var _init = function () {
        this.prototype.init();
    };

    var _debug = function (msg, meta) {
        // source, detail, function
        meta.function = meta.function || '{}';
        meta.detail = meta.detail || '';
        var metaDetail = '- ' + meta.source + ' ' + meta.function + '()\t\t' + msg + meta.detail;
        this.prototype.debug( metaDetail );
    };

    var _info = function (msg, meta) {
        meta.function = meta.function || '{}';
        meta.detail = meta.detail || '';
        var metaDetail = ' (' + meta.source + ':' + meta.function + ') ' + meta.detail;
        this.prototype.info(msg + metaDetail);
    };

    var _error = function (msg, meta) {
        meta.function = meta.function || '{}';
        meta.detail = meta.detail || '';
        var metaDetail = ' (' + meta.source + ':' + meta.function + ') ' + meta.detail;
        this.prototype.error(msg + metaDetail);
    };

    var _security = function (msg, meta) {
        meta.function = meta.function || '{}';
        meta.detail = meta.detail || '';
        var metaDetail = ' (' + meta.source + ':' + meta.function + ') ' + meta.detail;
        this.prototype.security(msg + metaDetail);
    };

    var _exception = function (msg, meta) {
        meta.function = meta.function || '{}';
        meta.detail = meta.detail || '';
        var metaDetail = ' (' + meta.source + ':' + meta.function + ') ' + meta.detail;
        this.prototype.exception(msg + metaDetail);
    };

    var _audit = function (msg, meta) {
        meta.function = meta.function || '{}';
        meta.detail = meta.detail || '';
        var metaDetail = ' (' + meta.source + ':' + meta.function + ') ' + meta.detail;
        this.prototype.audit(msg + metaDetail);
    };

    this.on('debug', _debug);
    this.on('info', _info);
    this.on('error', _error);
    this.on('security', _security);
    this.on('exception', _exception);
    this.on('audit', _audit);
    this.on('init', _init);

};

var Plugin = function (bdApi) {
    util.inherits(AppLogger, events.EventEmitter);
    var logger = new AppLogger(bdApi);
    
    this.prototype = {
        log: function log(msg) {
            logger.emit('init');
            logger.emit('debug', msg, {source: 'Generic Debug Handler'});
        },
        
        debug: function debug(msg, meta) {
            logger.emit('init');
            logger.emit('debug', msg, meta);
        },

        info: function info(msg, meta) {
            logger.emit('init');
            logger.emit('info', msg, meta);
        },

        error: function error(msg, meta) {
            logger.emit('init');
            logger.emit('error', msg, meta);
        },

        security: function security(msg, meta) {
            logger.emit('init');
            logger.emit('security', msg, meta);
        },

        exception: function exception(msg, meta) {
            logger.emit('init');
            logger.emit('exception', msg, meta);
        },

        audit: function audit(msg, meta) {
            logger.emit('init');
            logger.emit('audit', msg, meta);
        }
    };
};

module.exports = function (bdApi) {
    var plugin = new Plugin(bdApi);
    return plugin.prototype;
};