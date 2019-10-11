var meta = {source: 'lib/security.js'};

var Security = function Security(api) {

  this.prototype = {
    invalidData: function invalidData(res, msg) {
        api.logger.security('Issuing 400 for invalid data.', meta);
        res.send(msg, 400);
    },

    subGuardian: function subGuardian(req, res, next) {
        api.log("SECURITY: Guardian Activated");

        req.bodyValidated = {};
        req.paramsValidated = {};

        if (req.body) {
            api.log('SECURITY: Detected incoming data. Checking for security issues.');

            if (req.headers['content-type'] === 'application/json' || req.headers['content-type'] === 'application/json; charset=UTF-8') {
                api.log('SECURITY: Content-Type is ok. (application/json)');
                next();
            } else {
                api.logger.security('Issuing 403 Forbidden for bad content-type: ' + req.headers['content-type'], meta);
                res.send('Forbidden', 403);
            }
        }

        api.log("SECURITY: Guardian Finished");
    },

    crossDomain: function crossDomain(req, res, next) {
      api.logger.debug('Adding Cross Domain Headers', meta);

      res.header('Access-Control-Allow-Origin', api.corsOptions.origin);
      res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST']);
      res.header('Access-Control-Allow-Headers', 'accept, authorization, content-type');
      next();
    }
  };
};

module.exports = function (bdApi) {
    var security = new Security(bdApi);
    return security.prototype;
};
