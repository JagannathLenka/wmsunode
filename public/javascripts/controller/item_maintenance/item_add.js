wms.controller('ItemMasterAddCtrl', function ($scope, $http, $q, $routeParams, $location, Auth) {
 
    var app_parameters = Auth.getAppParameters()
    var client = app_parameters.client
    var warehouse = app_parameters.warehouse
    baseUrl = '/item_master_maintenance'
	


   $scope.item_header = {};

   $scope.globalInfo = {
   	error: false,
   	warning: false,
   	info: false 
   };
   
   $scope.status = {}
   $scope.status.isFirstOpen = true;
	
   $scope.statuses = [
    {value: 'Active', text: 'Active'},
    ]; 
   
   
   $scope.concept = [
    {value: 'AB', text: 'AB'},
    {value: 'BC', text: 'BC'},
    ]; 

    $scope.clear = function() {
	   $scope.item_header= {};
	   };
  
   
  $scope.header_template = {
        name: 'header_template',
        url: '/templates/item_maintenance/item_header.html'
        };

 $scope.saveHeader = function() {
	
    var fields_to_update = {};
    fields_to_update = $scope.item_header;
    var url = baseUrl + '/?client=' + client + '&warehouse='+ warehouse;
    return $http.post(url, {
    	'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
    	app_parameters: app_parameters,
    	fields_to_update: fields_to_update
    }).success(function(data){ 		
    	$scope.item = data;
 		setInfo('info', 'Item Created Successfully');

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


