modelFiles = {
    src: [
        'src/common.js',
        'src/base.js',
        'src/model/model.js',
        'src/model/collection.js'
    ],
    test: [
        'test/*Spec.js'
    ],
    angular: [
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js'
    ]
};

if (exports) {
    exports.files = modelFiles;
}