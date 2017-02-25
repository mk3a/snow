"use strict";
var angular = require('angular');

module.exports = function CodeEditorController($scope) {
	$scope.code = '#include<iostream.h>\nint main(){\n\tfloat a = 45.23;\n\tcout<<a<<"Hello World";\n}';
}
