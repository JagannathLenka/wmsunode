wms.controller('ShipmentAddCtrl', function ($scope, $http, $q, $stateParams, $location, Auth) {

   var app_parameters = Auth.getAppParameters()	
   var client = app_parameters.client
   var warehouse = app_parameters.warehouse
   var baseUrl = '/shipment_maintenance'
  
   $scope.to_shipment_header_id = $stateParams.to_shipment_header_id;
   $scope.shipment_header = {};
   $scope.shipment_detail = {};
   
   $scope.shipment_header.client = client
   $scope.shipment_header.warehouse = warehouse
   $scope.shipment_detail.client = client
   $scope.shipment_detail.warehouse = warehouse


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

   $scope.AsnType = [
    {value: 'PO', text: 'PO'},
    {value: 'Inbound', text: 'Inbound'},
    {value: 'Warehouse Transfer', text: 'Warehouse Transfer'}
    ]; 

    //$scope.editableForm.show();

    $scope.clear = function() {
	   $scope.shipment_header= {};
	   $scope.shipment_detail= {};	
	   };
  
   
    $scope.header_template = {
        name: 'header_template',
        url: '/templates/shipment_maintenance/shipment_header.html'
        };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/shipment_maintenance/shipment_detail.html'
        };



 $scope.saveHeader = function() {
	
    var fields_to_update = {};
    fields_to_update = $scope.shipment_header;
    var url = baseUrl + '/add_header?client=' + client + '&warehouse=' + warehouse;
    return $http.post(url, {
    	'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
    	app_parameters: app_parameters,
    	fields_to_update: fields_to_update
    }).success(function(data){ 		
    	$scope.shipment_header = data.shipment_header;
		$scope.shipment_details = data.shipment_detail;    
 		setInfo('info', 'Shipment Created Successfully');

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


 $scope.saveDetail = function() {
    var fields_to_update = {};
    fields_to_update = $scope.shipment_detail;
    fields_to_update.asn_header_id = $scope.to_shipment_header_id;
   

    var url = baseUrl + '/add_detail?client=' + client + '&warehouse=' + warehouse;
    return $http.post(url, {
        'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
        app_parameters: app_parameters,
        fields_to_update: fields_to_update
    }).success(function(data){
        $scope.shipment_header = data.shipment_header;
        $scope.shipment_detail = data.shipment_detail;
        setInfo('info', 'Shipment detail added');
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

