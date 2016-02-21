function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

angular.module("top.nemanja.party", ["ngAnimate", "ui.bootstrap", "ui.bootstrap-slider", "angularSoundManager"])
.config(['$interpolateProvider', function($interpolateProvider) {
	return $interpolateProvider.startSymbol('{(').endSymbol(')}');
	}
])
.controller("Player", function($http, $scope, $log, YoutubeSearch, angularPlayer, $rootScope){
	$('.volume').popover({html: true});

	$scope.results = [];

	$scope.query = "";

    $scope.search = function () {
		YoutubeSearch($scope.query, function(data){
			$scope.results = [];

			angular.forEach(data.items, function(value, key){
				var song = {
					thumbnail: value.snippet.thumbnails.default.url,
					title: value.snippet.title,
					url: "/stream/"+value.id.videoId, 
					id: value.id.videoId,
					artist: value.title
				}

				$scope.results.push(song);
			});
		});		
    }

	$scope.downloadSong = function(id){
		window.open("download/"+id);
	}

	$scope.deleteSong = function(song, id){
		angularPlayer.removeSong(song.id, id);
	}

	$scope.search();
	
	$scope.filter = "";

	$scope.volumetemplate = "volumetemplate.html";

	$scope.volume = {};
	$scope.volume.value = angularPlayer.getVolume();

	$scope.setVolume = function(){
		console.log($scope.volume.value);

		angularPlayer.adjustVolumeSlider($scope.volume.value);
	};

	$scope.song = {};

	$scope.log = function(data){
		console.log(data);
	}

	$scope.song.duration = 0;
	$scope.song.position = 0;

	$scope.move = function(){
		var sound = soundManager.getSoundById(angularPlayer.getCurrentTrack());
		sound.setPosition($scope.song.position);
	}

	$scope.current = {};

	$scope.current.mins = pad(0, 2);
	$scope.current.secs = pad(0, 2);

	$scope.total = {};

	$scope.total.mins = pad(0, 2);
	$scope.total.secs = pad(0, 2);

	$scope.$on('currentTrack:position', function(event, data) {
		$scope.current.mins = pad(Math.floor(Math.floor(data/1000)/60), 2);
		$scope.current.secs = pad(Math.floor(data/1000) - Math.floor(Math.floor(data/1000)/60)*60, 2);

	    $scope.song.position = data;
	});

	$scope.$on('currentTrack:duration', function(event, data) {
		$scope.total.mins = pad(Math.floor(Math.floor(data/1000)/60), 2);
		$scope.total.secs = pad(Math.floor(data/1000) - Math.floor(Math.floor(data/1000)/60)*60, 2);

	    $scope.song.duration = data;
	});

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
})
.factory('YoutubeSearch', function($http, $log) {
	return function(query, callback) {
		$http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				key: 'AIzaSyA9QbsxQOQ4JzLWGolLaGrRLcmyrqnzCZo',
				type: 'video',
				maxResults: '50',
				part: 'id,snippet',
				videoCategoryId: 10, 
				fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
				q: query
			}
		})
		.success( function (data) {
			callback(data);

			$log.info(data);
		})
		.error( function (err) {
			console.log(err);
			$log.info('Search error');
		});
	};
});

