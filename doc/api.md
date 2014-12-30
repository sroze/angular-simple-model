API
===

- [Common API](#common-api)
- [Model API](#model-api)
- [Collection API](#collection-api)

# Common API

`Model` and `Collection` classes extends an initial `BaseModel` class, which is described here.

## Attributes

### `url` (string or function)

The url on which we have to sync the model or collection.

## Methods

### `initialize`

Called by the constructor, this method will take the `options` and override if needed the `url` and `baseUrl` attributes.

### `computeUrl(path, parameters)`

Replace the parameters in URL `path` with the given `parameters` bag.

### `parse(httpResponse, options)`

Called when the server response is received.

- `httpResponse` is the object from `$http` service
- `options` are the options given to the `sync` method

On a model, it must return an object, that will be the attributes of that object and an array for collections.

### `prepare(attributes)`

Called before sending a request to the server, to create the request body.

- `attributes` are the object attributes

It return an object that will be sent as request body.

### `fetch(options)`

Fetch the object from API.

- `options` is optional and is an object that is given to the `options` argument of `sync` method.

It return the `sync` promise.

### `save(options)`

Send a POST request to the API, with the prepared request body (by `prepare` method).

- `options` is optional and is an object that is given to the `options` argument of `sync` method.

It return the `sync` promise.

### `destroy(options)`

Send a `DELETE` request without body.

It return the `sync` promise.

### `sync(method, data, options)`

Launch a request to the API.

- `method` is the HTTP method of the request
- `data` is the request body
- `options` is an object containing options for the given request. The following options are supported:
    - `method`: Override the HTTP method
    - `url`: Override the request URL
    - `data`: Override the request body

This method return a deferred.
- The success callback will receive the current object as argument
- The error callback will receive an `httpResponse` object created by the [`$http` service](https://docs.angularjs.org/api/ng/service/$http).

### `_resolve(field)`

This method is used internally to resolve the `url` value which can be a string or a function.

# Model API

These attributes and methods are in addition to the common attributes and methods.

## Attributes

### `baseUrl` (string)

The url that will be computed to the model URL. Arguments can be added in the URL with the `{foo}` format: it will be replaced by the value of the `foo` attribute if it exists.

### `attributes` (object)

The raw object of the instance attributes.

## Methods

### Constructor

It takes two optional arguments:
- `attributes` (object): Initial attributes of model
- `options`: An array of options that will be computed by the `initialize` method

### `has(key)`

Return true if an attribute with the given `key` exists, false otherwise.

### `get(key)`

Return the value of `key` attribute, `undefined` otherwise.

### `set(key, value)`

Set (or override) the value of the attribute for the given key.

# Collection API

These attributes and methods are in addition to the common attributes and methods.

## Attributes

### `model` (object)

**Must be set**: the class of the models contained in the collection.

### `models` (array)

An array of the models in the collection.

### `attributes` (array)

An array of the attributes of models in the collection. It's no more than an array of references to the `attributes` object of each model.

## Methods

### Constructor

It takes two optional arguments:
- `models` (array): Initial models of collection
- `options`: An array of options that will be computed by the `initialize` method

### `_prepareModel(model, options)`

- `model` is a model instance or its attributes

If `model` isn't the model instance, it is create and the `options` are used as second argument of model constructor.

Return an instance of the model.

### `add(model, options)`

Add a model in the collection.

The `options` (object, optional) argument is used to send options to `_prepareModel`.

### `remove(model)`

Remove the given model from the collection.

### `removeIndex(index)`

Remove the model at the given index.

### `set(models, options)`

Replace models in the collection by the given models.
