"use strict";
var angular = require('angular');

module.exports = function CodeEditorController($scope) {
	// $scope.code = '/*THIS IS A COMMENT\nabc';
	$scope.code = '/*#include<iostream.h>\n\nint main(){\n//THIS IS A COMMENT\n\tfloat a = 45.23;\n\t*/\ncout<<a<<"Hello World";\n}';
}