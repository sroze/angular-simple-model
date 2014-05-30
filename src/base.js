/**
 * Base model that contain the common methods.
 *
 */
$BaseModelFactory.$inject = ['$http'];
function $BaseModelFactory($http) {
    // The base model.
    var BaseModel = function (data, options) {
        this.options = options || {};

        this.initialize.apply(this, arguments);
    };

    BaseModel.prototype.initialize = function () {
        if (this.options.baseUrl) {
            this.baseUrl = this.options.baseUrl;
        }
    };

    BaseModel.prototype.computeUrl = function(path, parameters) {
        if (parameters !== undefined && typeof parameters == 'object') {
            for (var key in parameters) {
                path = path.replace('{'+key+'}', parameters[key]);
            }
        }

        return path;
    };

    BaseModel.prototype.parse = function (httpResponse, options) {
        return httpResponse.data;
    };
    BaseModel.prototype.getOption = function (key) {
        return this.options[key];
    };
    BaseModel.prototype.setOption = function (key, value) {
        this.options[key] = value;
    };

    BaseModel.prototype.prepare = function (object) {
        return object;
    };
    BaseModel.prototype.fetch = function (options) {
        return this.sync('GET', undefined, options);
    };
    BaseModel.prototype.save = function (options) {
        return this.sync('POST', this.prepare(this.attributes), options);
    };
    BaseModel.prototype.destroy = function (options) {
        return this.sync('DELETE', undefined, options);
    };
    BaseModel.prototype._resolve = function (field) {
        return resolveValue(this, field);
    };

    BaseModel.prototype.sync = function (method, data, options) {
        options = angular.extend({
            method: method,
            url: this._resolve('url'),
            data: data
        }, options);

        if (options.method == 'GET' && options.data !== undefined) {
            options.url += options.url.indexOf('?') == -1 ? '?' : '&';
            options.url += $.param(options.data);
        }

        var self = this;
        return $http(options).then(function (httpResponse) {
            var model = self.parse(httpResponse, options);
            self.set(model);

            return httpResponse;
        });
    };

    BaseModel.extend = modelExtend;

    return BaseModel;
}

angular.module('angular-simple-model')
    .factory('BaseModel', $BaseModelFactory);
