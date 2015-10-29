wms.controller('UserMasterAddCtrl', function ($scope, $http, $q, $routeParams, $location, Auth) {
 
  var app_parameters = Auth.getAppParameters()
  var client    = app_parameters.client;
  var warehouse = app_parameters.warehouse
  var baseUrl = '/user_master_maintenance'	
  


   $scope.user_header = {};
   $scope.user_header.client = client;	

   $scope.globalInfo = {
   	error: false,
   	warning: false,
   	info: false 
   };
   
   $scope.statuses = [
    {value: 'Active', text: 'Active'},
    ]; 
   
   
 $scope.warehouse = [
        {value: 'WH1', text: 'PDC'},
        {value: 'WH2', text: 'WDC'}
    ];

    $scope.roles = [
        {value: 'admin', text: 'Admin'},
        {value: 'warehouse_manager', text: 'Warehouse Manager'},
        {value: 'warehouse_associate', text: 'Warehouse Associate'},
    ]; 

    $scope.clear = function() {
	   $scope.user_header= {};
	   };
  
   
  $scope.header_template = {
        name: 'header_template',
        url: '/templates/user_maintenance/user_header.html'
        };

 $scope.saveHeader = function() {
	
    var fields_to_update = {};
    fields_to_update = $scope.user_header;
    var url = baseUrl + '/?client=' + client + '&warehouse='+ warehouse;
    return $http.post(url, {
    	'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
    	app_parameters: {client: client},
    	fields_to_update: fields_to_update
    }).success(function(data){ 		
    	$scope.item = data;
 		setInfo('info', 'User Created Successfully');

    }).error(function(message){
    	if (message.status == '422')
    	{ 
    		setInfo('error', 'Validation Error');
    		angular.forEach(message.errors, function(error){
    			$scope.editableForm.$setError(error.field, error.message);
    		});
    	}

    	else {
    		 setInfo('error', message.message);

    	}
    });
 };


 var setInfo = function(infotype, message) {
     angular.forEach($scope.globalInfo, function (infoValue, infoKey) {
         if(infotype == infoKey) {
 			$scope.globalInfo[infoKey] = true
 		}
 		else{
 			$scope.globalInfo[infoKey] = false
 		}
 	});
 	$scope.global_notification = message;		

 };
  
  $scope.ok = function () {
    $location.path(baseUrl)
  };

});


