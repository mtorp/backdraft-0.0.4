var Plugin = function (bdApi) {
    var meta = {source: 'baseline/view.js'};

    bdApi.log('baseline: View Loaded');

    var model      = {}
        , rules    = {};

    this.prototype = {
        activeModel: function activeModel(activeModel, activeRules, next) {
            model  = activeModel;
            rules  = activeRules;
            next();
        },

        init: function init(req, res, next) {
            next();
        },

        renderItems: function renderItems(res, name, fields, model) {

            model
                .find()
                .select(fields)
                .exec(function renderItemsModel (err, records) {
                  output = {};
                  output[name] = records;
            
                  if (!res) return renderTest (output);
      
                  bdApi.log ('Rendering Items');
                  res.writeHead(200,{
                    'Content-type': 'application/json'
                  });
                  res.write(JSON.stringify(output || {}));
                  res.end();
                });
        },

        renderItem: function renderItem(res, document) {
            if (!res) return renderTest (document);

            bdApi.log ('Rendering Item Value');
            res.writeHead(200,{
                'Content-type': 'application/json'
            });
            res.write(JSON.stringify(document || {}));
            res.end();

            return true;
        },

        renderTest: function renderTest(object) {
            bdApi.log ('Assuming Test Mode - No Rendering');
            return object;
        },

        list: function list(req, res) {
            bdApi.log ('Listing.');

            controllerProject.document(req, res, function viewDocument (err, document){
                bdApi.log ('Listing ' + model.identification.name + ' Records');
                //api.log(document);
                if (model.identification.parentCollection) {
                    return exports.renderItems(res, document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection]);
                } else {
                    return exports.renderItems(res, document[model.identification.nameCollection]);
                }

            });
        },

        save: function save(req, res) {
            bdApi.log ('Saving ' + model.identification.name + ' for ' + auth.projectId(req));

            controllerProject.document(req, res, function viewSaveDocument (err, document){
                var collection = {};
                if (model.identification.parentCollection) {
                    collection = document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection];
                } else {
                    collection = document[model.identification.nameCollection];
                }


                bdApi.log('Adding ' + model.identification.name + ' Record');
                //api.log(JSON.Stringify(req.bodyValidated));

                if (req.bodyValidated[model.identification.nameValidation].passed) {                                                                           // Controller Specific
                    var instance    = new model.Model;

                    model.fields.forEach(function(element, index, array) {
                        if (req.body[element.key] && Array.isArray(element.value)) {
                            var subElement = {};

                            element.value.forEach(function(item) {
                                subElement[item] = req.bodyValidated[model.identification.nameValidation][element.key][item].value;
                            });

                            instance[element.key].push(subElement);
                        } else{
                            if (req.bodyValidated[model.identification.nameValidation][element])
                                instance[element] = req.bodyValidated[model.identification.nameValidation][element].value;
                        }
                    });

                    // Controller Specific
                    instance.dateCreated    = req.bodyValidated[model.identification.nameValidation].dateCreated.value;                                        // Controller Specific
                    instance._id            = req.bodyValidated[model.identification.nameValidation]._id.value;                                                // Controller Specific

                    collection.push(instance);
                    // Controller Specific

                    db.update(document, function viewSaveUpdate (err,document) {
                        bdApi.log('Stored ' + model.identification.name + ' Data');
                        return exports.renderItems(res, collection);                                                                  // Controller Specific
                    });
                } else {
                    bdApi.security.invalidData(res, 'Could not add. Bad ' + model.identification.name + ' submitted.');
                }

            });
        },

        change: function change(req, res) {
            bdApi.log ('Changing ' + model.identification.name);

            if (req.bodyValidated[model.identification.nameValidation].passed) {                                                                               // Controller Specific
                controllerProject.document(req, res, function viewSaveDocument (err, document){
                    bdApi.log ('Updating ' + model.identification.name + ' Record');                                                                                 // Controller Specific

                    model.fields.forEach(function(element) {
                        if (req.bodyValidated[model.identification.nameValidation][element.key] && Array.isArray(element.value)) {
                            var subElement = {};

                            element.value.forEach(function(item) {
                                subElement[item] = req.bodyValidated[model.identification.nameValidation][element.key][item].value;
                            });

                            document[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]._id.value)[element.key]
                                    = subElement;
                        } else {
                            if (req.bodyValidated[model.identification.nameValidation][element]) {
                                if (model.identification.parentCollection) {
                                    document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]._id.value)[element]
                                            = req.bodyValidated[model.identification.nameValidation][element].value;
                                } else {
                                    document[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]._id.value)[element]
                                            = req.bodyValidated[model.identification.nameValidation][element].value;
                                }
                            }
                        }
                    });                                                              // Controller Specific

                    db.update(document, function viewSaveUpdate (err,document) {
                        bdApi.log('Stored ' + model.identification.name + ' Data');
                        return exports.renderItems(res, document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection]);                                                                  // Controller Specific
                    });
                });
            } else {
                bdApi.security.invalidData(res, 'Could not update. Bad ' + model.identification.name + ' submitted.');
            }
        },

        remove: function remove(req, res) {
            bdApi.log ('Removing ' + model.identification.name);
            bdApi.log(JSON.Stringify(req.bodyValidated));

            if (req.bodyValidated[model.identification.nameValidation].passed) {                                                                               // Controller Specific
                controllerProject.document(req, res, function viewRemoveDocument (err, document){
                    bdApi.log ('Deleting ' + model.identification.name + ' Record ' + req.params['record_id']);

                    if (model.identification.parentCollection) {
                        if (document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]['_id'].value)) {                                         // Controller Specific
                            document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]['_id'].value).remove(                                    // Controller Specific
                                    function viewRemoveAction (err) {
                                        bdApi.log ('Removed ' + model.identification.name + ' Data');

                                        db.update(document, function viewRemoveUpdate (err,document) {
                                            bdApi.log ('Stored ' + model.identification.name + ' Data');
                                            return exports.renderItems(res, document[model.identification.nameCollection]);                                                      // Controller Specific
                                        });
                                    });
                        } else {
                            bdApi.log ('Warning - ' + model.identification.name + ' Record Did Not Exist');
                            return exports.renderItems(res, document);
                        }
                    } else {
                        if (document[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]['record_id'].value)) {                                         // Controller Specific
                            document[model.identification.nameCollection].id(req.bodyValidated[model.identification.nameValidation]['record_id'].value).remove(                                    // Controller Specific
                                    function viewRemoveAction (err) {
                                        bdApi.log ('Removed ' + model.identification.name + ' Data');

                                        db.update(document, function viewRemoveUpdate (err,document) {
                                            bdApi.log ('Stored ' + model.identification.name + ' Data');
                                            return exports.renderItems(res, document[model.identification.nameCollection]);                                                      // Controller Specific
                                        });
                                    });
                        } else {
                            bdApi.log ('Warning - ' + model.identification.name + ' Record Did Not Exist');
                            return exports.renderItems(res, document);
                        }
                    }
                });
            } else {
                bdApi.security.invalidData(res, 'Could not delete. Bad ' + model.identification.name + ' submitted.');
            }

        },

        show: function show (req, res, next) {                            // Controller Specific
            controllerProject.document(req, res, function viewShowDocument (err, document){
                if (model.identification.parentCollection) {
                    bdApi.log ('Showing ' + model.identification.name + ' Record for ' + req.params['subKey']);
                    return exports.renderItems(res, document[model.identification.parentCollection].id(req.params['record_id'])[model.identification.nameCollection].id(req.params['subKey']));
                } else {
                    bdApi.log ('Showing ' + model.identification.name + ' Record for ' + req.params['record_id']);
                    return exports.renderItem(res, document[model.identification.nameCollection].id(req.params['record_id']));
                }                                               // Controller Specific
            });
        }
    };

};

module.exports = function (bdApi) {
    var plugin = new Plugin(bdApi);
    return plugin.prototype;
};
