login.controller('LoginCtrl', function ($scope, $location, $localStorage, $http, $q) {

   $scope.statuses = [
    {value: 'Active', text: 'Active'},
    ]; 
   

 $scope.login = function() {
	
    var url = '/login'
    return $http.post(url, {
    	 userid: $scope.userid,
         password: $scope.password
    }).success(function(data){
		$localStorage.token = data['additional_info'][0]['token']
		delete $localStorage.app_parameters
        window.location = '/main.html';
    }).error(function(message){
        $scope.message = 'Invalid User Id or Password';
    });
 };


});


