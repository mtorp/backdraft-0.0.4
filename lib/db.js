var meta = {source: 'lib/db.js'};

var Plugin = function Plugin(api) {
    this.prototype = {
        connect: function connect() {
            meta.function = 'connect';
            api.log('db: Connecting to Database');

            var url = 'mongodb://' + api.config.database.name;

            if (api.config.database.user && api.config.database.pass) {
                url = 'mongodb://' + api.config.database.user + ':' + api.config.database.pass + '@' + api.config.database.name;
            }

            api.mongoose.connect(url, function (e) {
                if (e) {
                    meta.detail = e;
                    api.logger.exception('Database Connection Error', meta);
                    api.handler.errorHandler(e);
                    api.handler.shutdown();
                }
            });
        },

        disconnect: function disconnect() {
            meta.function = 'disconnect';
            api.log('db: Disconnecting from database.');
        },

        create: function create(record, model, next) {
            meta.function = 'create';
            api.logger.debug('Adding Record', meta);
          
            var input = new model(record);
            input.save(function create (err) {
              if (err) api.logger.error(err, meta);
              api.logger.debug('Saved (Create).', meta);
              next(err, record);
            });          
        },

        update: function update(record, next) {
            meta.function = 'update';

            api.logger.debug('Updating Record', meta);

            record.modified = new Date();

            record.save(function dbUpdate(err) {
                if (err) api.logger.error(err, meta);
                api.logger.debug('Saved (Update).', meta);
                next(err, record);
            });
        }
    };
};


module.exports = function (bdApi) {
    var plugin = new Plugin(bdApi);
    return plugin.prototype;
};