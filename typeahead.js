(function () {
	'use strict';

	angular.module('typeahead', [])

	.directive('typeahead', ['$http', function ($http) {
		return {
			restrict: 'E',

			scope: {
				name: '@',
				placeholder: '@',
				params: '=',
				queryKey: '@',
				titleKey: '@',
				subtitleKey: '@',
			},

			compile: function() {
				return function(scope, elem, attrs) {

					var selectOrReset = function (item) {
						if(item === null) {
							scope.model = null;
						}
						else {
							scope.model = item[scope.titleKey];
							item.query = item[scope.queryKey];
						}

						scope.params[scope.name] = item;
						scope.hideList = true;
						scope.items = null;
					};

					scope.update = function () {
						// create the search query
						var params = { params: { query: scope.model } };
						$.each(scope.params, function(key) {
							if(key !== scope.name && scope.params[key] !== null)
								params.params[key] = scope.params[key].query;
						});

						// get data and highlight the first row
						$http.get(attrs.src, params).then(function (response) {
							scope.items = response.data;
							scope.current = 0;
						});

						scope.params[scope.name] = null;
						scope.hideList = false;
					};

					scope.focus = function () {
						scope.update();

						// highlight the text
						elem.find('input').select();
					};

					scope.handleSelection = function () {
						var item = scope.items[scope.current];
						selectOrReset(item);
					};

					scope.isActive = function (index) {
						return scope.current == index;
					};

					scope.setActive = function (index) {
						scope.current = index;
					};
				}
			},

			templateUrl: '/components/typeahead/typeahead.html'
		};
	}]);
})();
