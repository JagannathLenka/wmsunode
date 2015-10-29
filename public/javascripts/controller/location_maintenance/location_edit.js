wms.controller('LocationMasterEditCtrl', function ($scope, $filter, $http, $location, $q, $stateParams, UserService, Auth) {


    var location_id = $stateParams.header_id
    var app_parameters = Auth.getAppParameters();
    var client = app_parameters.client;
    var warehouse = app_parameters.warehouse;
    baseUrl = '/location_master_maintenance';
    	

    var url = baseUrl + '/'+ location_id + '.json?client=' + client + '&warehouse='+ warehouse;
    $http.get(url).success(function(data) {
        $scope.location_header = data.location_header;
    }).error(function(){
        console.log('failed to call')
    });
    

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
    
    
    $scope.header_template = {
        name: 'header_template',
        url: '<%= asset_path('location_maintenance/location_header.html') %>'
        };


    $scope.updateHeader = function(data, el, id) {
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d)
        return d.promise;
    };

    $scope.ok = function () {
        $location.path(baseUrl);
    };

});
