var Plugin = function (bdApi) {
  var mongoose = require('mongoose'),
      Schema = mongoose.Schema;
  
  var meta = {source: 'baseline/model.js'};
  bdApi.log('baseline: Model Loaded');
  
  function createModel (modelName, modelObject) {
    var Schema = mongoose.Schema;
    var schemaObject = new Schema(modelObject);

    /*
    schemaObject.virtual('id').get(function () {
      return this._id;
    });
    */
    
    return mongoose.model(modelName, schemaObject);
  }
  
  this.prototype = {
    result: function result (valValue, valPassed) {
      bdApi.log('Validation: Creating Result Object');
      var obj = {};
      obj.passed = valPassed;
      obj.value = (valPassed) ? valValue : undefined;
      obj.valueFailed = (valPassed) ? undefined : valValue;

      return obj;
    },
    create: createModel,
    add: function add (res, name, model, record, next) {
      bdApi.log ('Adding Record');
      var go = this;
      bdApi.db.create(record, model, function addCreate (err, document) {
        bdApi.log('Added');
        next(document);                                                                  // Controller Specific
      });
    }    
  }
    
};

module.exports = function (bdApi) {
  var plugin = new Plugin(bdApi);
  return plugin.prototype;
};
