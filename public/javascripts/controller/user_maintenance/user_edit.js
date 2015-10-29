wms.controller('UserMasterEditCtrl', function ($scope, $filter, $http, $location, $q, $stateParams, UserService, Auth) {


    var user_id = $stateParams.header_id

    var app_parameters = Auth.getAppParameters();
	var client    = app_parameters.client;
	var warehouse = app_parameters.warehouse
	var baseUrl = '/user_master_maintenance'	
	
	$scope.client = client
    $scope.warehouse = warehouse

    var url = baseUrl + '/'+ user_id + '.json?client=' + client + '&warehouse='+ warehouse;
    $http.get(url).success(function(data) {
        $scope.user_header = data.user_header;
    }).error(function(){
        console.log('failed to call')
    });



    $scope.statuses = [
        {value: 'Active', text: 'Active'},
        {value: 'Inactive', text: 'Inactive'}
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
    
    $scope.header_template = {
        name: 'header_template',
        url: '/templates/user_maintenance/user_header.html'
        };


    $scope.updateHeader = function(data, el, id) {
    	var d = $q.defer();
        var url = baseUrl + '/'+ id
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };

    $scope.ok = function () {
        $location.path(baseUrl);
    };

});
