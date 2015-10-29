wms.controller('ShipmentEditCtrl', function ($scope, $filter, $http, $location, $q, $stateParams, UserService, Auth) {

	var baseUrl = '/shipment_maintenance'
    var shipment_header_id = $stateParams.header_id
    var shipment_detail_id = $stateParams.detail_id
	var app_parameters = Auth.getAppParameters()
	
    var client = app_parameters.client
    var warehouse = app_parameters.warehouse

    if (shipment_header_id != null) {
        var url = baseUrl + '/'+  shipment_header_id + '.json?client=' + client + '&warehouse='+ warehouse + '&expand=true';
        $http.get(url).success(function (data) {
            $scope.shipment_header = data.shipment_header
            $scope.shipment_details = data.shipment_detail
            console.log($scope.shipment_details)
            $scope.shipment_detail = $filter('search')(data.shipment_detail, shipment_detail_id, 'id');

        }).error(function(){
            console.log('failed call');
        });
    };


    $scope.YesorNo = [
        {value: 'Y', text: 'Yes'},
        {value: 'N', text: 'No'},
    ];


    $scope.header_template = {
        name: 'header_template',
        url: '/templates/shipment_maintenance/shipment_header.html'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/shipment_maintenance/shipment_detail.html'
    };


    $scope.statuses = [
        {value: 'Created', text: 'Created'},
        {value: 'Initiated', text: 'Initiated'},
        {value: 'In Fullfilment', text: 'In Fullfilment'},
        {value: 'Verified', text: 'Verified'},
        {value: 'Cancelled', text: 'Cancelled'}
    ];


    $scope.updateHeader = function(data, el, id) {
        var url = baseUrl + '/' + id + '/update_header' ;
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d)
        return d.promise;
    };

    $scope.updateDetail = function(data, el, id) {
        var url =  baseUrl + '/' + id + '/update_detail';
        var d = $q.defer();
        d= UserService.updateResource(data, el, id, url, $scope, d)
        return d.promise;
    };

    $scope.ok = function () {
        $location.path(baseUrl);
    };

});

