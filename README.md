Angular Simple Model
====================

[![Build Status](https://travis-ci.org/sroze/angular-simple-model.svg?branch=master)](https://travis-ci.org/sroze/angular-simple-model)

This angular module provide base model objects usable in your AngularJS application, designed like the Backbone models.

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Advanced usage](#advanced-usage)
- [Running tests](#tests)

- [API](doc/api.md)

# Installation

Just add `angular-simple-model` in your `bower.json` dependencies:

```json
{
    "dependencies": {
        "angular-simple-model": "~0.3.0"
    }
}
```

Then, run `bower install`.

If you're using [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep) the JS file will be injected automatically by Grunt, else you'll have to add the JavaScript file:
```html
<script type="text/javascript" src="bower_components/angular-simple-module/release/angular-simple-model.min.js"></script>
```

# Basic usage

Everything is built on the `Collection` and `Model` factories. These classes provide a lot of methods that are common between your models and collections.
A collection is quite no more than an array of models.

## Require the angular module

You have to require the `angular-simple-model` module to be able to inject the provided factories:
```js
angular.module('your-module', [
    'dependency',
    // ...
    'angular-simple-model'
]);
```

## Create models and collections

To create your custom model, you just have to extend the `Model` "class" with the `extend` method which take one or two parameters.

The parameter is the instance methods and attributes while the second (optional) is the class methods.

```js
angular.module('your-module')
    .factory('Task', function(Model) {
        return Model.extend({
            baseUrl: '/path/to/your/api/task/{id)'
        });
    });
```

```js
angular.module('your-module')
    .factory('TaskCollection', function(Collection, Task) {
        return Collection.extend({
            baseUrl: '/path/to/your/api/tasks',
            model: Task
        });
    });
```

## Fetch and save them

You can now inject your models and collections where you want, in your services, controllers...

Here's a task list controller example:
```
angular.module('your-module')
    .controller('TaskListCtrl', function($scope, TaskCollection) {
        var tasks = new TaskCollection();

        $scope.isLoading = true;
        tasks.fetch().then(function(tasks) {
            $scope.tasks = tasks.attributes;
        }, function(error) {
            $scope.error = 'Unable to fetch tasks';
        })['finally'](function() {
            $scope.isLoading = false;
        });
    });
```

Then, you're show/update controller could be:
```
angular.module('your-module')
    .controller('TaskCtrl', function($scope, $routeParams, Task) {
        // Get your task ID
        var taskId = $routeParams.id;

        // Create the task model
        var task = new Task({id: taskId});

        // Fetch the task
        $scope.isLoading = true;
        task.fetch().then(function(task) {
            $scope.task = task.attributes;
        }, function(error) {
            $scope.error = 'Unable to fetch task #'+taskId;
        })['finally'](function() {
            $scope.isLoading = false;
        });

        // Add an `save` method callable form your view
        $scope.save = function() {
            task.save().then(function() {
                alert('Saved !');
            }, function() {
                alert('An error appeared while saving task');
            });
        };
    });
```

As you can see, the main point is that you're attaching the `attributes` attribute of the instance to the scope which is the object (or array for collections) that make your model usable as a simple object at the view side. Using `ng-model` or any other binding way you're able to update the model content without accessing directly the instance methods such as `save`, `fetch`, etc...

## Parse from and prepare to API

And the power come from these instance methods: let's say you're `Task` model has a `name` and a `date` attribute. You may fetch this date from the API encoded as an [ISO-6801](http://en.wikipedia.org/wiki/ISO_8601) but want to use it in your AngularJS application as a `Date` object.
You just have to override the `prepare` and `parse` methods of your object the make this transformations:

```js
angular.module('your-module')
    .factory('Task', function(Model) {
        return Model.extend({
            baseUrl: '/path/to/your/api/task/{id)',

            // Will be called when the server response is received
            parse: function() {
                // Get attributes from the "native" way by calling super
                var attributes = Model.prototype.parse.apply(this, arguments);

                // Create the `Date` object
                attributes.date = new Date(attributes.date);

                return attributes;
            },

            // Will be called when creating the data sent to the server
            prepare: function(attributes) {
                return {
                    name: attributes.name,
                    date: attributes.date.toISOString()
                }
            }
        });
    });
```

**Note:** check the [EC5 `toISOString` method support](http://kangax.github.io/compat-table/es5/#Date.prototype.toISOString) to use it in production.

# Advanced usage

By creating custom instance methods, you can for instance create a method on the `Task` model to get its related issues easily:

```js
angular.module('your-module')
    .factory('Task', function(Model, IssueCollection) {
        return Model.extend({
            baseUrl: '/path/to/your/api/task/{id)',
            getIssues: function() {
                return new IssueCollection([], {
                    url: this.url()+'/issues'
                });
            })
        };
    });
```

You can then fetch the task issues:
```js
var task = new Task({id: taskId});
task.getIssues().fetch().then(function(issues) {
    $scope.issues = issues.attributes;
});
```

**Note:** this assumes that you previously created an `IssueCollection` class.

[You can now have a look to the API that describes all available methods and their usage on models and collections.](doc/api.md)

# Running tests

Tests can be run directly with npm:
```
npm test
```
