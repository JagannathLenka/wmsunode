wms.controller('ItemMasterListCtrl', function ($scope, $http,  $location, $filter, $q, UserService, Auth) {

    $scope.last_status = 'Created';
    $scope.lastitem = {};
    $scope.detail  = {}
    $scope.header  = {}
    $scope.expand = 0
    $scope.squeeze = 100
    var baseUrl = '/item_master_maintenance'
    var app_parameters = Auth.getAppParameters()

    $scope.search_items = [
        {value: 'barcode', text: 'Barcode'},
        {value: 'item', text: 'Item'},
        {value: 'description', text: 'Description'}
    ];

    $scope.search_choice = $scope.search_items[0]

    $scope.choose = function(choice) {
        $scope.search_choice = choice;
        $scope.item_list = []
        angular.forEach($scope.items, function(item) {
            $scope.item_list.push(item["item_header"][$scope.search_choice.value]);
        });
    }

    $scope.item = 'new item';

    $scope.header_template = {
        name: 'header_template',
        url: '/templates/item_maintenance/item_header.html'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/item_maintenance/item_detail.html'
    };

    $scope.showItem = function(show, item, item_detail_id) {
        var url = baseUrl + '/' + item 

        $http.get(url).success(function(data) {
            $scope.item_header = data.item_header
            $scope.item_details = data.item_detail

            if (show == 'Header') {
                $scope.header.show = true
                $scope.detail.show = false
            } else {
                $scope.detail.show = true
                $scope.header.show = false
                angular.forEach($scope.item_details, function (item_detail) {
                    if (item_detail.id == item_detail_id) {
                        $scope.item_detail = item_detail;
                    }
                });
            }
        });

        $scope.expand = 50
        $scope.squeeze = 50
        $scope.selected_header_id = item
        $scope.selected_detail_id = item_detail_id
    }

    $scope.hideItem= function() {
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

    $scope.editItem= function(header_id, detail_id) {
        var url =  baseUrl + '/edit/'+ header_id + '/'
        if(detail_id != null) {
            url += detail_id
        }

        $location.path(url);
    }

    $scope.updateHeader = function(data, el, id) {
        var url = baseUrl + '/'+ id
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };


    $scope.init = function() {

        var url = baseUrl + '?client=' + app_parameters.client + '&warehouse=' + app_parameters.warehouse ;

        $http.get(url).success(function(data) {
            $scope.items = data;
            $scope.item_list = []

            $scope.filter_from_object = "item_header"
            $scope.filter_from_field = "status"

            UserService.set_page($scope);

            $scope.status('Active');

            angular.forEach($scope.items, function(item) {
                $scope.item_list.push(item["item_header"][$scope.search_choice.value]);
            });

        });

    };

    $scope.init();
});
