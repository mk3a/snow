"use strict";
var angular = require('angular');

module.exports = function CodeEditorController($scope) {
	$scope.code = "";
	$scope.code = "abc def ghi jkl mno 123 @#$ \"!'~` +-()"
	$scope.test = function () {
		console.log("got here");
	}
}
