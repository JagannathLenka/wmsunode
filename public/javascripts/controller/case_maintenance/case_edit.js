wms.controller('CaseEditCtrl', function ($scope, $filter, $http, $location, $q, $stateParams, UserService, Auth) {

    var case_header_id = $stateParams.header_id
    var case_detail_id = $stateParams.detail_id

    var baseUrl = '/case_maintenance'
    var shipment_header_id = $stateParams.header_id
    var shipment_detail_id = $stateParams.detail_id
	var app_parameters = Auth.getAppParameters()
	var client    = app_parameters.client;
  	var warehouse = app_parameters.warehouse;
	

    if (case_header_id != null) {
        var url = baseUrl + '/'+  case_header_id + '.json?client=' + client + '&warehouse='+ warehouse;
        $http.get(url).success(function (data) {
            $scope.case_header = data.case_header
            $scope.case_detail = $filter('search')(data.case_detail, case_detail_id, 'id');

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
        url: '/templates/case_maintenance/case_header.html'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/case_maintenance/case_detail.html'
    };



    $scope.statuses = [
        {value: 'Created', text: 'Created'},
        {value: 'Received', text: 'Received'},
        {value: 'Consumed', text: 'Consumed'}
    ];

    $scope.updateHeader = function(data, el, id) {
        var url = baseUrl + '/'+ id + '/update_header' ;
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d)
        return d.promise;
    };

    $scope.updateDetail = function(data, el, id) {
        var url = baseUrl + '/'+ id + '/update_detail';
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d)
        return d.promise;
    };

    $scope.ok = function () {
        $location.path(baseUrl);
    };



});