app.controller("RadioController", function($scope){
	$scope.div = 0 ;
	
	$scope.detailsPanel = 0;

	
	$scope.setDiv = function(divNr){
		$scope.div = divNr;
	}
	$scope.getDiv = function(){
		return $scope.div;
	}

})