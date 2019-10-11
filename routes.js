var meta = {source: 'routes.js'};

module.exports = function (api) {
    api.corsOptions = {
        origin: api.config.server.hostClient,
        methods: ['GET', 'PUT', 'POST']
    };

    if (api.config.api.path) {
      api.app.options(api.config.api.path + '/:controller', api.cors(api.corsOptions));

      api.app.get(api.config.api.path + '/authenticate', api.cors(api.corsOptions), api.response.authenticated);
      api.app.post(api.config.api.path + '/authenticate', api.cors(api.corsOptions), api.auth.login, api.auth.buildSession);

      api.app.post(api.config.api.path + '/register', api.cors(api.corsOptions), api.response.register);
      api.app.post(api.config.api.path + '/logout', api.cors(api.corsOptions), api.auth.logout);

      api.app.get(api.config.api.path + '/user', api.cors(api.corsOptions), api.auth.ensureAuthenticated, api.response.accountInfo);
    } else {
      api.app.options(api.config.app.path + ':controller', api.cors(api.corsOptions));

      api.app.get(api.config.app.path + 'authenticate', api.cors(api.corsOptions), api.response.authenticated);
      api.app.post(api.config.app.path + 'authenticate', api.cors(api.corsOptions), api.auth.login, api.auth.buildSession);

      api.app.post(api.config.app.path + 'register', api.cors(api.corsOptions), api.response.register);
      api.app.post(api.config.app.path + 'logout', api.cors(api.corsOptions), api.auth.logout);

      api.app.get(api.config.app.path + 'user', api.cors(api.corsOptions), api.auth.ensureAuthenticated, api.response.accountInfo);
    }


};

