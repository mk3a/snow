var angular2 = require('angular')
angular.module('snow')
	.directive('codeFull', function () {
		function makeIntsBold(pureCodeString) {
			return pureCodeString.replace(/int/g, "<b>int</b>");
		}

		function filterBold(formattedCode) {
			return formattedCode.replace(/<b>|<\/b>/g, "");
		}
		return {
			require: 'ngModel',
			link: function (scope, elem, attrs, mdlCtrlr) {
				console.log(scope);
				console.log(mdlCtrlr);
				mdlCtrlr.$render = function () {
					elem.html(mdlCtrlr.$viewValue); //Inject Html String as Html into Div
				}
				elem.on('keyup blur paste', function () {
					var currentViewValue = elem.html();
					mdlCtrlr.$setViewValue(currentViewValue)
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
					runFormatters(mdlCtrlr);
				});
				mdlCtrlr.$formatters.push(makeIntsBold);
				mdlCtrlr.$parsers.push(filterBold);
				// elem.on('blur keyup paste', )
			}

		}
	})
