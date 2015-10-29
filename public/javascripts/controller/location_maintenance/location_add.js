wms.controller('LocationMasterAddCtrl', function ($scope, $http, $q, $routeParams, $location, Auth) {
 
  var app_parameters = Auth.getAppParameters()
  var client    = app_parameters.client;
  var warehouse = app_parameters.warehouse
  var baseUrl = '/location_master_maintenance'	
	
   $scope.location_header = {};
   

   $scope.globalInfo = {
   	error: false,
   	warning: false,
   	info: false 
   };
   
       $scope.YesorNo = [
        {value: 'Yes', text: 'Yes'},
        {value: 'No', text: 'No'}
    ];

    $scope.areas = [
        {value: 'A1', text: 'Area 1'},
        {value: 'A2', text: 'Area 2'}
    ];
    
    $scope.zones = [
        {value: 'Z1', text: 'Zone 1'},
        {value: 'Z2', text: 'Zone 2'}
    ];
   
    $scope.aisles = [
        {value: 'a1', text: 'Aisle 1'},
        {value: 'a2', text: 'Aisle 2'}
    ];
    
    $scope.bays = [
        {value: 'B1', text: 'Bay 1'},
        {value: 'B2', text: 'Bat 2'}
    ];
    
   $scope.levels = [
        {value: 'L1', text: 'Level 1'},
        {value: 'L2', text: 'Level 2'}
    ];
    
    $scope.positions = [
        {value: 'P1', text: 'Position 1'},
        {value: 'P2', text: 'Position 2'}
    ];
    
    

    $scope.clear = function() {
	   $scope.location_header= {};
	   };
  
   
  $scope.header_template = {
        name: 'header_template',
        url: '<%= asset_path('location_maintenance/location_header.html') %>'
        };

 $scope.saveHeader = function() {
	
    var fields_to_update = {};
    fields_to_update = $scope.location_header;
    var url = baseUrl + '/?client=' + client + '&warehouse='+ warehouse;
    return $http.post(url, {
    	'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
    	app_parameters: app_parameters,
    	fields_to_update: fields_to_update
    }).success(function(data){ 		
    	$scope.location_header = data.location_header;
 		setInfo('info', 'Location Created Successfully');

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
    $location.path(baseUrl);
  };

});


