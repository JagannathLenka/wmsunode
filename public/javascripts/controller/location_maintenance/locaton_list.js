wms.controller('LocationMasterListCtrl', function ($scope, $http,  $location, $filter, $q, UserService, Auth) {

    $scope.last_status = 'Created';
    $scope.lastitem = {};
    $scope.detail  = {};
    $scope.header  = {};
    $scope.expand = 0;
    $scope.squeeze = 100;
    
    var app_parameters = Auth.getAppParameters()
  	var client    = app_parameters.client;
  	var warehouse = app_parameters.warehouse
  	var baseUrl = '/location_master_maintenance'	

    $scope.search_items = [
        {value: 'barcode', text: 'Barcode'},
        {value: 'location_type', text: 'Location Type'}
    ];
    
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
    
 

    $scope.search_choice = $scope.search_items[0]

    $scope.choose = function(choice) {
        $scope.search_choice = choice;
        $scope.item_list = []
        angular.forEach($scope.items, function(item) {
            $scope.item_list.push(item["location_header"][$scope.search_choice.value]);
        });
    }

    $scope.item = 'new location';

    $scope.header_template = {
        name: 'header_template',
        url: '<%= asset_path('location_maintenance/location_header.html') %>'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '<%= asset_path('location_maintenance/location_detail.html') %>'
    };

    $scope.showLocation = function(show, location, location_detail_id) {
        var url = baseUrl + '/'+  location + '.json'

        $http.get(url).success(function(data) {
            $scope.location_header = data.location_header
            console.log(data)
            $scope.location_details = data.location_detail

            if (show == 'Header') {
                $scope.header.show = true
                $scope.detail.show = false
            } else {
                $scope.detail.show = true
                $scope.header.show = false
                angular.forEach($scope.location_details, function (location_detail) {
                    if (location_detail.id == location_detail_id) {
                        $scope.location_detail = location_detail;
                    }
                });
            }
        });

        $scope.expand = 50
        $scope.squeeze = 50
        $scope.selected_header_id = location
        $scope.selected_detail_id = location_detail_id
    }

    $scope.hideLocation= function() {
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

    $scope.editLocation= function(header_id, detail_id) {
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

        var url = baseUrl + '.json?client=' + client + '&warehouse='+ warehouse;

        $http.get(url).success(function(data) {
            $scope.items = data;
            $scope.item_list = []

            $scope.filter_from_object = "location_header"
            $scope.filter_from_field = "status"

            UserService.set_page($scope);

            $scope.status('*All');

            angular.forEach($scope.items, function(item) {
                $scope.item_list.push(item["location_header"][$scope.search_choice.value]);
            });

        });

    };

    $scope.init();
});
