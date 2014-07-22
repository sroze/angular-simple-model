describe("Model", function () {
    var baseModel;

    beforeEach(module('angular-simple-model'));
    beforeEach(function() {
        inject(function(Model) {
            baseModel = Model;
        });
    });

    describe("attributes", function() {
        it('should populate attributes', function () {
            var attrs = {foo: 'bar', i: 2},
                model = new baseModel(attrs);

            expect(model.get('foo')).toBe('bar');
            expect(model.get('i')).toBe(2);
        });

        it('should define an identifier with id', function () {
            var model = new baseModel({
                id: 2
            });

            expect(model.getIdentifier()).toEqual(2);
        });

        it('should define an identifier with custom key', function () {
            var model = new (baseModel.extend({
                identifierKey: 'uuid'
            }))({
                uuid: '1234567890'
            });

            expect(model.getIdentifier()).toEqual('1234567890');
        });
    });

    describe("url", function () {
        it('must accept baseUrl function', function () {
            var model = new (baseModel.extend({
                baseUrl: function () {
                    return 'test';
                }
            }))();

            expect(model.url()).toEqual('test');
        });

        it('should populate parameters', function () {
            var attrs = {'foo': 'bar', 'bar': 'foo'},
                model = new (baseModel.extend({
                    baseUrl: 'http://example.com/{foo}/{bar}'
                }))(attrs);

            expect(model.url()).toEqual('http://example.com/bar/foo');
        });
    });

    describe("scope mapping", function () {
        var scope;

        beforeEach(function () {
            inject(function($rootScope) {
                scope = $rootScope.$new();
            });
        });

        it('must keep attributes in sync', function () {
            var model = new baseModel({
                foo: 'bar'
            });

            scope.model = model.attributes;
            expect(scope.model).toBeDefined();
            expect(scope.model.foo).toEqual('bar');
            expect(scope.model.bar).toBeUndefined();

            scope.model.bar = 'foo';
            expect(model.get('bar')).toEqual('foo');
        });
    });
});