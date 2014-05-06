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
});