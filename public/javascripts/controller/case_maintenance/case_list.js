wms.controller('CaseListCtrl', function ($scope, $http,  $location, $filter, $modal, $q,  UserService, Auth) {

    $scope.last_status = 'Created';
    $scope.lastitem = {};
    $scope.detail  = {}
    $scope.header  = {}
    $scope.expand = 0
    $scope.squeeze = 100
    $scope.search_choice = {value: 'case_id', text: 'Case Id'}
    
    var baseUrl = '/case_maintenance';
	var app_parameters = Auth.getAppParameters();
	var client    = app_parameters.client;
  	var warehouse = app_parameters.warehouse;

    $scope.case = 'new case';


    $scope.search_items = [
        {value: 'case_id', text: 'Case Id'},
        {value: 'shipment_nbr', text: 'Shipment Number'},
        {value: 'purchase_order_nbr', text: 'PO Number'}
    ];

    $scope.choose = function(choice) {
        $scope.search_choice = choice;
        $scope.case_list = []
        angular.forEach($scope.items, function(item) {
            $scope.case_list.push(item["case_header"][$scope.search_choice.value]);
        });
    }



    $scope.header_template = {
        name: 'header_template',
        url: '/templates/case_maintenance/case_header.html'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/case_maintenance/case_detail.html'
    };

    $scope.showCase = function(show, case_id, case_detail_id) {
        var url = baseUrl +'/'+  case_id + '.json'
        $scope.data = {}
        $http.get(url).success(function(data) {
            $scope.case_header = data.case_header
            $scope.case_details = data.case_detail

                if (show == 'Header') {
                    $scope.header.show = true
                    $scope.detail.show = false
                } else {
                    $scope.detail.show = true
                    $scope.header.show = false
                    angular.forEach($scope.case_details, function (case_detail) {
                        if (case_detail.id == case_detail_id) {
                            $scope.case_detail = case_detail;
                        }
                    });
                }
            });

        $scope.expand = 50
        $scope.squeeze = 50
        $scope.selected_header_id = case_id
        $scope.selected_detail_id = case_detail_id
    }

    $scope.hideCase = function() {
        $scope.header.show= false
        $scope.detail.show= false
        $scope.expand = 0
        $scope.squeeze = 100
    };


    $scope.toggleExpand = function(item) {
        item.show = !item.show;
        lastitem = item;
    };

    $scope.expand = function(item) {
        item.show = true;
    };

    $scope.editCase= function(header_id, detail_id) {
        var url =  baseUrl + '/edit/'+ header_id + '/'
        if(detail_id != null) {
            url += detail_id
        }
        $location.path(url);
    }

    $scope.updateHeader = function(data, el, id) {
        var url = baseUrl + '/'+ id + '/update_header';
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };

    $scope.updateDetail = function(data, el, id) {
        var url = baseUrl + '/'+ id + '/update_detail';
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };

    $scope.init = function() {
        console.log('case')
        var url = baseUrl + '.json?client=' + client + '&warehouse='+ warehouse;
        $http.get(url).success(function(data) {
            $scope.items = data;
            $scope.case_list = []

            $scope.filter_from_object = "case_header"
            $scope.filter_from_field = "record_status"

            UserService.set_page($scope);

            $scope.status(null);

            angular.forEach($scope.items, function(item) {
                console.log(item["case_header"]["record_status"])
                $scope.case_list.push(item["case_header"][$scope.search_choice.value]);
            });

        });

    };

    $scope.init();
});
