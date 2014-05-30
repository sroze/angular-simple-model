describe("BaseModel", function () {
    var baseModel;

    beforeEach(module('angular-simple-model'));
    beforeEach(function() {
        inject(function(BaseModel) {
            baseModel = BaseModel;
        });
    });

    describe("constructor", function () {
        it("should call initialize", function () {
            spyOn(baseModel.prototype, 'initialize');
            var model = new baseModel();

            expect(model.initialize).toHaveBeenCalled();
        });


        it("should call initialize with constructor arguments", function () {
            spyOn(baseModel.prototype, 'initialize');
            var attributes = {'foo': 'bar'},
                options = {'bar': 'foo'},
                model = new baseModel(attributes, options);

            expect(model.initialize).toHaveBeenCalledWith(attributes, options);
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