var Plugin = function (bdApi) {
    var meta = {source: 'lib/submodule.js'};
    var fs          = require('fs')
            , load      = {};

    bdApi.logger.debug('Submodules: Loading', meta);

    module.exports.use          = load;

    bdApi.config.app.submodules.forEach(function (sm) {
        meta.function = 'loader';

        var file = '/submodules/' + sm + '/admin/index.js';

        if (fs.existsSync('.' + file)) {
            load[sm] = require('..' + file);
            bdApi.logger.debug('Admin Initialize: ' + sm, meta);
        } else {
            bdApi.logger.debug('Admin NOT Initializing: ' + sm + ' (' + file + ')', meta);
        }
    });


    bdApi.logger.debug('Submodules: Done', meta);


};

module.exports = function (bdApi) {
    //var plugin = new Plugin(bdApi);
    //return plugin.prototype;
    return {};
};
