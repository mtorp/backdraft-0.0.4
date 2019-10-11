var config                = require('../config/settings.manager.json')
    , system              = require('../lib/api')
    , auth                = require('../lib/auth')
    , db                  = require('../lib/db')
    , Account             = require('../models/account');

var logMeta = {source: 'controllers/account.js'};

exports.document = function accountDocument (req, res, next) {
    logMeta.document = 'document';
    system.log('controllers/account: Starting Account Instance Setup');
    
    getAccount (req, res, function accountDocumentGetAccount (err, instance) {
        if (err || !instance) {
            logMeta.detail = (err) ? err : 'Account Document not found! (' + req.user._id + ')';
            system.logger.exception('Missing Account Document', logMeta);
            system.errorHandler(logMeta, req, res);
        }

        if (instance.accountId) {
            system.log('controllers/account: Account Found - ' + instance.accountId);
            next(null,instance);
        } else {
            system.logger.error('ERROR ESTABLISHING INSTANCE OF USER!', logMeta);
        }

        system.log('controllers/account: Completed Account Instance');
    });

}

function getAccount (req, res, next) {
    logMeta.function = 'getAccount';
    system.log('controllers/account: Getting Instance of Account.');
    var instance = {};
            
    system.log('controllers/account: Setting user information.');
    instance.accountId = auth.accountId(req);
    
    Info.model.findOne({accountId: instance.accountId}, function getAccountInfo (err, record) {
        if (record) {
            if (err) {
                logMeta.detail = (err) ? err : 'Account info not found! (' + req.user._id + ')';
                system.logger.exception('Missing info document.', logMeta);
                system.errorHandler(logMeta, req, res);
            }

            system.log('controllers/account: Setting info.');
            instance.info = record;

        } else {
            system.log('controllers/account: Existing account not found. Starting a new one.');
            newAccount (req,res,function newAccountInstance (err, instance) {
                next(null,instance);
            });
        }
    });
}

function newAccount(req, res, next) {
    logMeta.function = 'newAccount';
    system.log('controllers/account: Creating Instance of new Account.');

    var instance = {};
    instance.info       = new Info.model;

    // initial values
    instance.accountId = auth.accountId(req);
    instance.info.accountId   = auth.accountId(req);

    system.log('controllers/account: Storing new Instance of Account Info.');
    db.create(instance.info, function newAccountInfoCreate() {
            logMeta.detail = 'Account: ' + instance.accountId;
            system.logger.audit('Set up new user', logMeta);
            next(err, instance);
    });

}

