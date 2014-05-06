
$CollectionFactory.$inject = ['BaseModel'];
function $CollectionFactory (BaseModel) {
    return BaseModel.extend({
        constructor: function (models, options) {
            BaseModel.prototype.constructor.apply(this, arguments);

            this.models = models || {};
        },
        getAttributesArray: function () {
            var collection = [];

            for (var i = 0; i < this.models.length; i++) {
                collection.push(this.models[i].attributes);
            }

            return collection;
        },
        url: function () {
            return this.computeUrl(this._resolve('baseUrl'));
        },
        set: function (models, options) {
            if (models.length === undefined) {
                return;
            }

            this.models = [];
            for (var i = 0; i < models.length; i++) {
                this.models.push(this._prepareModel(models[i], options));
            }
        },
        _prepareModel: function (attrs, options) {
            return new this.model(attrs, options);
        }
    });
}

angular.module('angular-simple-model')
    .factory('Collection', $CollectionFactory);
