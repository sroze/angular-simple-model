
$CollectionFactory.$inject = ['BaseModel'];
function $CollectionFactory (BaseModel) {
    return BaseModel.extend({
        constructor: function (models, options) {
            BaseModel.prototype.constructor.apply(this, arguments);

            this.models = [];
            this.attributes = [];

            this.set(models || []);
        },
        getAttributesArray: function () {
            return this.attributes;
        },
        url: function () {
            return this.computeUrl(this._resolve('baseUrl'));
        },
        add: function (model, options) {
            var prepared = this._prepareModel(model, options);

            this.models.push(prepared);
            this.attributes.push(prepared.attributes);
        },
        remove: function (model) {
            for (var i = 0; i < this.models.length; i++) {
                if (this.models[i].getIdentifier() == model.getIdentifier()) {
                    this.removeIndex(i);

                    break;
                }
            }
        },
        removeIndex: function (index) {
            this.models.splice(index, 1);
            this.attributes.splice(index, 1);
        },
        set: function (models, options) {
            var i;
            for (i=this.models.length-1; i>=0; i--) {
                this.removeIndex(i);
            }

            if (models.length === undefined) {
                return;
            }

            for (i = 0; i < models.length; i++) {
                this.add(models[i], options);
            }
        },
        _prepareModel: function (attrs, options) {
            if (attrs instanceof this.model) {
                return attrs;
            }

            return new this.model(attrs, options);
        }
    });
}

angular.module('angular-simple-model')
    .factory('Collection', $CollectionFactory);
