wms.controller('MainCtrl', function ($scope, $http,  $location, $localStorage, $filter, $q, Auth) {
  
  $scope.app_parameters ={}
  $scope.header_template = {
        name: 'header_template',
        url: '/template/main/main_header.html'
        };
         
  $scope.warehouses = 
  [
    {value: 'WH1', text: 'WH1'},
    {value: 'WH2', text: 'WH2'},
    {value: 'WH3', text: 'WH3'},
    {value: 'WH4', text: 'WH4'}
  ]; 
  
    $scope.clients = 
  [
    {value: 'WM', text: 'WM'},
    {value: 'WM1', text: 'WM1'},
    {value: 'WM2', text: 'WM2'},
    {value: 'WM3', text: 'WM3'}
  ]; 
  
	if (Auth.getTokenClaims()) 
		{
			token = Auth.getTokenClaims()
		    if (!$localStorage.app_parameters) {
		   		$scope.app_parameters.client = token.client;
		    	$scope.app_parameters.updated_user = token.user_id;
		    	$scope.app_parameters.warehouse = token.preferred_warehouse;
		    	$scope.app_parameters.building = '';
		    	$scope.app_parameters.channel = '';		    	
		    	$localStorage.app_parameters = $scope.app_parameters	 
		    } else {
		   		$scope.app_parameters.client = $localStorage.app_parameters.client;
		    	$scope.app_parameters.updated_user = $localStorage.app_parameters.user_id;
		    	$scope.app_parameters.warehouse = $localStorage.app_parameters.preferred_warehouse;	 
			   	$scope.app_parameters.building = '';
		    	$scope.app_parameters.channel = '';   	
		    }
	    
	      	    
	}
	
    
    $scope.saveHeader = function() {
    	$localStorage.app_parameters = $scope.app_parameters	   
    }
        
 	
 	$scope.signout = function() {
 		delete $localStorage.token;
 		delete $localStorage.app_parameters;
 		window.location = '/login'
 	}
   
        
});