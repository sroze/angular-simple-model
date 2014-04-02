describe("BaseModel", function () {
    var baseModel;

    beforeEach(module('angular-simple-model'));
    beforeEach(function() {
        inject(function(BaseModel) {
            baseModel = BaseModel;
        });
    });

    describe("options", function() {
        it('should be object by default', function () {
            var model = new baseModel();
            expect(model.options).toEqual({});
        });

        it('should override baseUrl', function () {
            var model = new (baseModel.extend({
                    baseUrl: 'foo'
                }))(undefined, {
                    baseUrl: 'bar'
                });

            expect(model.baseUrl).toBe('bar');
        });
    });
});