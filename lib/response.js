var meta        = {source: 'lib/response.js'};
Account = require('./../models/account');

var Responder = function Responder(api) {   
    
    this.prototype = {
        account: Account,

        identify: function identify(req, res) {
            meta.function = 'first';
            api.handler.response(req, res, {'name': 'BackDraft'});
        },
        
        authenticated: function authenticated(req, res) {
          meta.function = 'authenticated';
					api.logger.info('Authentication', meta);
          
          if (req.isAuthenticated()) {
              api.handler.response(req, res, {auth: { id: 1, authenticated: true }});
          } else {
              api.handler.response(req, res, {auth: { id: 1, authenticated: false }});
          }
        },

        register: function register(req, res) {
            meta.function = 'register';
            Account.register(new Account({
                email: req.body.registration.email,
                firstName: req.body.registration.firstName,
                lastName: req.body.registration.lastName
            }), req.body.registration.password, function (err, account) {
                if (err) {
                    api.handler.response(req, res,
                            {'registration': false,
                                'error': 'Registration Failed',
                                'errorCode': 'ERR001',
                                'account': {'username': '', 'id': ''}});
                } else {
                    //Need to authenticate and send account content.
                    api.handler.response(req, res, {'account': {'username': account.username, 'id': account._id}} );
                }
            });
        },

        accountInfo: function account(req, res) {
            meta.function = 'account';
            api.logger.info('Account Info', meta);
          
            if (req.isAuthenticated()) {
              api.handler.response(req, res, {authenticated: true, user: {firstName: 'Bobby', lastName: 'Tables', email: 'little@bobbytables.com'}});
            } else {
              api.handler.response(req, res, {authenticated: false, user: null});
            }
        }       
    };

};

module.exports = function (api) {
    var responder = new Responder(api);
    return responder.prototype;
};