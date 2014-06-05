/**
 * Simple model for AngularJS
 * @version v0.1.7
 * @link http://github.com/sroze/angular-simple-model
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'angular-simple-model';
}

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

/**
 * For each loop of array.
 *
 * @type {Function}
 */
var nativeForEach = Array.prototype.forEach,
    each = function(obj, iterator, context) {
        if (obj != null) {
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            }
        }
    };

/**
 * Is this object has that key.
 *
 * @param obj
 * @param key
 * @returns {boolean}
 */
var has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * Extend an object.
 *
 * @type {Function}
 */
var extend = function(obj) {
        each(Array.prototype.slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });

        return obj;
    };

/**
 * Helper function to correctly set up the prototype chain, for subclasses.
 * Similar to `goog.inherits`, but uses a hash of prototype properties and
 * class properties to be extended.
 *
 * @param protoProps
 * @param staticProps
 * @returns {*}
 */
var modelExtend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

/**
 * Resolve an object attribute. If that attribute is a function, call it.
 *
 * @param object
 * @param attribute
 * @returns {*}
 */
var resolveValue = function (object, attribute) {
    if (object == null) return void 0;
    var value = object[attribute];
    return typeof value == "function" ? value.call(object) : value;
};

/**
 * Angular module declaration.
 *
 */
angular.module('angular-simple-model', ['ng']);

/**
 * Base model that contain the common methods.
 *
 */
$BaseModelFactory.$inject = ['$http', '$q'];
function $BaseModelFactory($http, $q) {
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

        var abortDeferred;
        if (options.timeout === undefined) {
            abortDeferred = $q.defer();
            options.timeout = abortDeferred.promise;
        }

        var self = this,
            promise = $http(options).then(function (httpResponse) {
            var model = self.parse(httpResponse, options);
            self.set(model);

            return httpResponse;
        });

        if (abortDeferred !== undefined) {
            promise.abort = function () {
                if (abortDeferred) {
                    promise.aborted = true;
                    abortDeferred.resolve();
                }
            };

            promise['finally'](function () {
                abortDeferred = null;
            });
        }

        return promise;
    };

    BaseModel.extend = modelExtend;

    return BaseModel;
}

angular.module('angular-simple-model')
    .factory('BaseModel', $BaseModelFactory);


$ModelFactory.$inject = ['BaseModel'];
function $ModelFactory (BaseModel) {
    return BaseModel.extend({
        constructor: function (attributes, options) {
            BaseModel.prototype.constructor.apply(this, arguments);

            this.attributes = attributes || {};
        },
        has: function (key) {
            return key in this.attributes;
        },
        get: function (key) {
            return this.attributes[key];
        },
        set: function (key, value) {
            if (typeof key == "string") {
                this.attributes[key] = value;
            } else if (typeof key == "object") {
                for (var k in key) {
                    this.set(k, key[k]);
                }
            }
        },
        save: function (attributes, options) {
            this.set(attributes);

            return BaseModel.prototype.save.call(this, options);
        },
        url: function () {
            return this.computeUrl(this._resolve('baseUrl'), this.attributes);
        }
    });
}

angular.module('angular-simple-model')
    .factory('Model', $ModelFactory);


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
})(window, window.angular);