login.controller('LoginCtrl', function ($scope, $location, $localStorage, $http, $timeout, $q) {

   $scope.statuses = [
    {value: 'Active', text: 'Active'},
    ]; 
  
 console.log($localStorage);

 $scope.login = function() {


    var url = '/login'
    return $http.post(url, {
    	 userid: $scope.userid,
         password: $scope.password
    }).success(function(data){
		$localStorage.token = data['additional_info'][0]['token']
        $timeout(function(){
           window.location = '/main.html'
        }, 100);
    }).error(function(message){
        $scope.message = 'Invalid User Id or Password';
    });
 };


});


