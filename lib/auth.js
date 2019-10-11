var meta = {source: 'lib/auth.js'};

var Auth = function Auth(api) {
    var  passport          = require('passport')
            , LocalStrategy     = require('passport-local').Strategy
            , Account           = require('../models/account');

    passport.use(new LocalStrategy(Account.authenticate()));
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
	
	
		api.hash = function hash(content) {
			meta.function = 'hash';
			api.logger.debug('Creating Hashed User ID', meta);

			var crypto = require('crypto')
					, shasum = crypto.createHash('sha512')
					, result = '';
			shasum.update(content +  api.config.hashSalt);

			result = shasum.digest('hex');

			return result;
		}

	api.mongoose.connect('mongodb://' + api.config.database_auth.host + '/' + api.config.database_auth.name);	
	
    this.prototype = {
        passport: passport,

				buildSession: function buildSession(req, res) {
					meta.function = 'buildSession';
					api.logger.debug('Building Session', meta);
	
					if (req.isAuthenticated()) {
						api.handler.response(req, res, { account: {
              code: 200,
              authenticated: true,
              lastName: req.user.lastName,
              firstName: req.user.firstName,
							email: req.user.email,
						  id: api.hash(req.user.email)
						}});
					} else {
						api.handler.response(req, res, {
							code: 401, 
							authenticated: false
						});
					}
				},			
			
        isAuthenticated: function isAuthenticated(req, res) {
            meta.function = 'isAuthenticated';
            api.logger.debug('Checking Authentication', meta);

            if (req.isAuthenticated()) {
                api.handler.response(req, res, {code: 200,authenticated: true});
            } else {
                api.handler.response(req, res, {code: 401, authenticated: false});
            }
        },

        ensureAuthenticated: function ensureAuthenticated(req, res, next) {
            meta.function = 'ensureAuthenticated';
            api.logger.debug('Ensuring Authentication', meta);

            if (req.isAuthenticated()) {
                next();
            } else {
                api.handler.response(req, res, {code: 401, authenticated: false});
            }
        },

        login: function login(req, res, next) {
            meta.function = 'login';
            api.logger.debug('Logging In', meta);

            // Huh?
            req.body.username = req.body.auth.email;
            req.body.password = req.body.auth.password;
          
            //req.body = req.body.auth;

            api.auth.passport.authenticate('local', function(err, user, info) {
                if (err) { return next(err); }
                if (!user) {
                  api.handler.response(req, res, {code: 401, authenticated: false, reason: "Bad Username or Password"});
                } else {
                  req.logIn(user, function(err) {
                    if (err) {
                      return next(err);
                    }
                    next();
                  });                  
                }
            })(req, res, next);

        },

        logout: function logout(req, res) {
            meta.function = 'logout';
            api.logger.debug('Logging Out', meta);

            req.logout();
            api.handler.response(req, res, {code: 401, authenticated: false, reason: "Logged Out"});
        },

        accountId: function accountId(req) {
            meta.function = 'accountId';
            api.logger.debug('Getting Account ID', meta);

            return api.hash(req.user._id + req.user.hash + req.user.salt);
        },

        hash: api.hash
    };

};

module.exports = function (bdApi) {
    meta.function = 'exports';
    bdApi.logger.debug('Exporting Auth', meta);

    var auth = new Auth(bdApi);
    return auth.prototype;
};
