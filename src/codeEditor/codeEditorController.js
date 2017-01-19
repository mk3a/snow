angular.module('snow')
	.controller('CodeEditorController', ['$scope', CodeEditorController]);

function CodeEditorController($scope) {
	$scope.foo = "int <b> MEOW </b> ASDFASDF";
}
