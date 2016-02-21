function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

function isJson(str) {
	var data;

	try {
		data = JSON.parse(str);
    } catch (e) {
		return false;
	}
	return data;
}
function encode(data){
	data = data
		.replace("š", "s")
		.replace("đ", "dj")
		.replace("č", "c")
		.replace("ć", "c")
		.replace("ž", "z")
		.replace("Š", "S")
		.replace("Đ", "Dj")
		.replace("Č", "C")
		.replace("Ć", "Ć")
		.replace("Ž", "Ž")
		.replace(/[^\x00-\x7F]/g, "");

	return data;
}


angular.module("top.nemanja.party", ["base64", "ngAnimate", "ui.bootstrap", "ui.bootstrap-slider", "angularSoundManager"])

.config(['$interpolateProvider', '$locationProvider', function($interpolateProvider, $locationProvider) {
	$locationProvider.html5Mode(false);
	$interpolateProvider.startSymbol('{(').endSymbol(')}');
}])

.controller("Player", function($uibModal, $base64, $location, $http, $scope, $log, YoutubeSearch, angularPlayer, $rootScope){
	$('.volume').popover({html: true});

	$scope.results = [];

	$scope.query = "";

    $scope.search = function () {
		YoutubeSearch($scope.query, function(data){
			$scope.results = [];

			angular.forEach(data.items, function(value, key){
				var song = {
					thumbnail: value.snippet.thumbnails.default.url,
					title: encode(value.snippet.title),
					url: "/stream/"+value.id.videoId, 
					id: value.id.videoId,
					artist: value.title
				}

				$scope.results.push(song);
			});
		});		
    }

	if($location.hash() !== ""){
		var playlist;
		if(playlist = isJson($base64.decode($location.hash()))){
			angular.forEach(playlist, function(song, key){
				song.url = "/stream/"+song.id;

				angularPlayer.addToPlaylist(song);
			});
		}
	}

	$scope.animationsEnabled = true;

	$scope.openShare = function (size) {

		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'share.html',
			controller: 'shareCtrl',
			resolve: {
				url: function () {
					return $scope.shortUrl;
				}
			}
		});
	}

	$scope.share = function(){
		var playlist = angularPlayer.getPlaylist();

		var dataDump = [];

		angular.forEach(playlist, function(song, key){
			dataDump.push({
				id: song.id,
				title: song.title,
				thumbnail: song.thumbnail
			});
		});

		var site = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/##";

		$http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyA9QbsxQOQ4JzLWGolLaGrRLcmyrqnzCZo', {longUrl:site+$base64.encode(JSON.stringify(dataDump))}).success(function(data,status,headers,config){
            $scope.shortUrl = data.id;

			$scope.openShare();
        }).
        error(function(data,status,headers,config){

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
}).controller('shareCtrl', function ($scope, $uibModalInstance, url) {

	$scope.url = url;

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
});

