wms.controller('UserMasterListCtrl', function ($scope, $http,  $location, $filter, $q, UserService, Auth) {

    $scope.last_status = 'Created';
    $scope.lastitem = {};
    $scope.detail  = {}
    $scope.header  = {}
    $scope.expand = 0
    $scope.squeeze = 100
    
	var app_parameters = Auth.getAppParameters()
	var client    = app_parameters.client;
	var warehouse = app_parameters.warehouse;
	var baseUrl = '/user_master_maintenance';	
    

    $scope.warehouse = [
        {value: 'WH1', text: 'PDC'},
        {value: 'WH2', text: 'WDC'}
    ];

    $scope.roles = [
        {value: 'admin', text: 'Admin'},
        {value: 'warehouse_manager', text: 'Warehouse Manager'},
        {value: 'warehouse_associate', text: 'Warehouse Associate'},
    ];

    $scope.search_items = [
        {value: 'user_name', text: 'User Name'},
        {value: 'user_id', text: 'User Id'}
    ];
    $scope.search_choice = $scope.search_items[0]

    $scope.choose = function(choice) {
        $scope.search_choice = choice;
        $scope.item_list = []
        angular.forEach($scope.items, function(item) {
            $scope.item_list.push(item["user_header"][$scope.search_choice.value]);
        });
    }

    $scope.item = 'new user';

    $scope.header_template = {
        name: 'header_template',
        url: '/templates/user_maintenance/user_header.html'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/user_maintenance/user_detail.html'
    };

    $scope.showUser = function(show, user, user_detail_id) {
        var url = baseUrl + '/'+  user + '.json'

        $http.get(url).success(function(data) {
            $scope.user_header = data.user_header
            $scope.user_details = data.user_detail
			console.log($scope.user_header);
            if (show == 'Header') {
                $scope.header.show = true
                $scope.detail.show = false
            } else {
                $scope.detail.show = true
                $scope.header.show = false
                angular.forEach($scope.user_details, function (user_detail) {
                    if (user_detail.id == user_detail_id) {
                        $scope.user_detail = user_detail;
                    }
                });
            }
        });

        $scope.expand = 50
        $scope.squeeze = 50
        $scope.selected_header_id = user
        $scope.selected_detail_id = user_detail_id
    }

    $scope.hideUser= function() {
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

    $scope.editUser= function(header_id, detail_id) {
        var url =  baseUrl + '/edit/'+ header_id + '/'
        if(detail_id != null) {
            url += detail_id
        }

        $location.path(url);
    }

    $scope.updateHeader = function(data, el, id) {
    	var d = $q.defer();
        var url = baseUrl + '/'+ id
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };


    $scope.init = function() {

        var url = baseUrl + '.json?client=' + client + '&warehouse='+ warehouse;

        $http.get(url).success(function(data) {
            $scope.items = data;
            $scope.item_list = []

            $scope.filter_from_object = "user_header"
            $scope.filter_from_field = "user_name"

            UserService.set_page($scope);

            $scope.status('*All');

            angular.forEach($scope.items, function(item) {
                $scope.item_list.push(item["user_header"][$scope.search_choice.value]);
            });

        });

    };

    $scope.init();
});
