angular.module("top.nemanja.party", ["ngAnimate", "ui.bootstrap"])
.controller("Search", function($http, $scope, $log){
	$scope.results = [];

	$scope.query = "";

    $scope.search = function () {
		$http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				key: 'AIzaSyA9QbsxQOQ4JzLWGolLaGrRLcmyrqnzCZo',
				type: 'video',
				maxResults: '50',
				part: 'id,snippet',
				videoCategoryId: 10, 
				fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
				q: $scope.query
			}
		})
		.success( function (data) {
			$scope.results = data;

			$log.info(data);
		})
		.error( function (err) {
			console.log(err);
			$log.info('Search error');
		});

		$scope.download = function(id){
			window.open("/stream/"+id);
		}
    }

	$scope.search();
})
.directive('myEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.myEnter);
				});

				event.preventDefault();
			}
		});
	};
});;

