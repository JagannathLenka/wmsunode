wms.controller('CaseAddCtrl', function ($scope, $http, $q, $stateParams, $location, Auth) {

    var baseUrl = '/case_maintenance';
    var case_header_id = $stateParams.to_case_header_id;
	var app_parameters = Auth.getAppParameters();
	var client    = app_parameters.client;
  	var warehouse = app_parameters.warehouse;


    $scope.case_header = {};
    $scope.case_detail = {};
    
    $scope.case_header.client = client;
    $scope.case_header.warehouse = warehouse;
    $scope.case_detail.client = client;
    $scope.case_detail.warehouse = warehouse;

    $scope.globalInfo = {
   	error: false,
   	warning: false,
   	info: false 
   };
   $scope.statuses = [
    {value: 'Created', text: 'Created'},
    ]; 
   
   
   $scope.YesorNo = [
    {value: 'Y', text: 'Yes'},
    {value: 'N', text: 'No'},
    ]; 

    $scope.clear = function() {
	   $scope.case_header= {};
	   $scope.case_detail= {};	
	   };
   
  $scope.header_template = {
        name: 'header_template',
        url: '/templates/case_maintenance/case_header.html'
                };

  $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/case_maintenance/case_detail.html'
        };



    $scope.saveDetail = function() {
        var fields_to_update = {};
        fields_to_update = $scope.case_detail;
        fields_to_update.case_header_id = case_header_id;

        var url = baseUrl + '/add_detail?client=' + client + '&warehouse='+ warehouse;
        return $http.post(url, {
            'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
             app_parameters: app_parameters,
             fields_to_update: fields_to_update
        }).success(function(data){
            $scope.case_header = data.case_header;
            $scope.case_detail = data.case_detail;
            setInfo('info', 'Case detail added');
        }).error(function(message){
            if (message.status == '422'){
                setInfo('error', 'Validation Error');
                angular.forEach(message.errors, function(error){
                    if(error.field == null)
                    {setInfo('error', error.message);}
                    else{
                        $scope.editableForm.$setError(error.field, error.message);
                    }

                });
            }
            else {
                setInfo('error', message.message);
            }
        });
    };

 $scope.saveHeader = function() {
	
    var fields_to_update = {};
    fields_to_update = $scope.case_header;
    var url = baseUrl + '/add_header?client=' + client + '&warehouse='+ warehouse;
    return $http.post(url, {
    	'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
    	app_parameters: app_parameters,
    	fields_to_update: fields_to_update
    }).success(function(data){ 		
    	$scope.case_header = data.case_header;
		$scope.case_details = data.case_detail;    
 		setInfo('info', 'Case Created Successfully');

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

