var angular = require('angular');
var codeEditorDirective = require('../codeEditor/codeEditorDirective');
var codeEditorController = require('../codeEditor/codeEditorController');
angular.module('snow', [])
	.directive('codeEditor', codeEditorDirective)
	.controller('codeEditorController', codeEditorController)
