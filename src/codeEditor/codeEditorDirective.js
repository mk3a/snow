"use strict";
var angular = require('angular');
var $ = require('jquery')
var formatLinesPipeline = require('./formattingPipelines.js').codeFormatter;
module.exports = function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, mdlCtrlr) {
			mdlCtrlr.$render = function () {
				// var singleLineDOM = $("<div></div>").append(mdlCtrlr.$viewValue);
				elem.append(mdlCtrlr.$viewValue);
			}
			elem.on('keyup blur paste', function () {
				/* Disabling this as currently only working on one way Model to View*/
				// var currentViewValue = elem.html();
				// mdlCtrlr.$setViewValue(currentViewValue)
			});

			//Necessary to update View again due to View changing model which changes view again.Hence we run all formatters.
			function runFormatters(ctrl) {
				// this function is a copy of the internal formatter running code.
				// https://github.com/angular/angular.js/issues/3407#issue-17469647
				var modelValue = ctrl.$modelValue;
				var formatters = ctrl.$formatters;
				var idx = formatters.length;
				var viewValue = modelValue;
				while (idx--) {
					viewValue = formatters[idx](viewValue);
				}
				if (ctrl.$viewValue !== viewValue) {
					ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
					ctrl.$render();
					ctrl.$$runValidators(modelValue, viewValue, angular.noop);
				}
			}
			scope.$watch("code", function (newValue, oldValue) {
				if (newValue != oldValue) runFormatters(mdlCtrlr);
			});
			mdlCtrlr.$formatters = formatLinesPipeline.reversePipeline() //Angular expects formatters in reverse array order
		}

	}
}
