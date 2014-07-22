describe("Collection", function () {
    var baseModel, baseCollection;

    beforeEach(module('angular-simple-model'));
    beforeEach(function() {
        inject(function(Model, Collection) {
            baseModel = Model;
            baseCollection = Collection.extend({
                model: baseModel
            });
        });
    });

    describe("url", function () {
        it('must accept baseUrl function', function () {
            var collection = new (baseCollection.extend({
                baseUrl: function () {
                    return 'test';
                }
            }))();

            expect(collection.url()).toEqual('test');
        });
    });

    describe("scope mapping", function () {
        var scope, foo, bar;

        beforeEach(function () {
            inject(function($rootScope) {
                scope = $rootScope.$new();

                foo = new baseModel({
                    foo: 'bar'
                });
                bar = new baseModel({
                    bar: 'foo'
                });
            });
        });

        it('attributes must be assignable to scope and contains models', function () {
            var collection = new baseCollection([foo, bar]);
            scope.collection = collection.attributes;

            expect(scope.collection).toBeDefined();
            expect(scope.collection.length).toEqual(2);

            expect(scope.collection[0].foo).toEqual('bar');
            expect(scope.collection[0].bar).toBeUndefined();

            expect(scope.collection[1].bar).toEqual('foo');
            expect(scope.collection[1].foo).toBeUndefined();
        });

        it('must keep models attributes in sync', function () {
            var collection = new baseCollection([foo, bar]);
            scope.collection = collection.attributes;

            expect(foo.get('foo')).toEqual('bar');
            expect(scope.collection[0].foo).toEqual('bar');

            scope.collection[0].foo = 'updated';
            scope.collection[0].bar = 'new';
            expect(foo.get('foo')).toEqual('updated');
            expect(foo.get('bar')).toEqual('new');

            bar.set('foo', 'new');
            expect(scope.collection[1].foo).toEqual('new');
        });
    });
});