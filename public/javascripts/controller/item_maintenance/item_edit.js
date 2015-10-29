wms.controller('ItemMasterEditCtrl', function ($scope, $filter, $http, $location, $q, $stateParams, UserService, Auth) {


    var item_id = $stateParams.header_id

    var app_parameters = Auth.getAppParameters()
    var client = app_parameters.client
    var warehouse = app_parameters.warehouse
    baseUrl = '/item_master_maintenance'

    var url = baseUrl + '/' + item_id + '.json?client=' + client + '&warehouse='+ warehouse;
    $http.get(url).success(function(data) {
        $scope.item_header = data.item_header;
    }).error(function(){
        console.log('failed to call')
    });


	$scope.status = {}
	$scope.status.isFirstOpen = true;
    $scope.statuses = [
        {value: 'Active', text: 'Active'},
        {value: 'Inactive', text: 'Inactive'}
    ];

    $scope.concept = [
        {value: 'AB', text: 'AB'},
        {value: 'BC', text: 'BC'},
    ];
    $scope.header_template = {
        name: 'header_template',
        url: '/templates/item_maintenance/item_header.html'
        };


    $scope.updateHeader = function(data, el, id) {
        var url = baseUrl + '/' + id
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d)
        return d.promise;

    };

    $scope.ok = function () {
        $location.path(baseUrl);
    };

});
