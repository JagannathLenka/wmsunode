wms.controller('ShipmentListCtrl', function ($scope, $http,  $location, $filter, $modal, $q, UserService, ShareService, Auth) {

    $scope.last_status = 'Created';
    $scope.lastitem = {};
    $scope.detail  = {}
    $scope.header  = {}
    $scope.expand = 0
    $scope.squeeze = 100
    $scope.search_choice = {value: 'shipment_nbr', text: 'Shipment Number'}
    var app_parameters = Auth.getAppParameters()
    var baseUrl = '/shipment_maintenance'
	
    var client = app_parameters.client
    var warehouse = app_parameters.warehouse

    $scope.searchIitems = [
	    {value: 'shipment_nbr', text: 'Shipment Number'},
    	{value: 'purchase_order_nbr', text: 'Purchase Order Number'}
 	 ]; 

    $scope.header_template = {
        name: 'header_template',
        url: '/templates/shipment_maintenance/shipment_header.html'
    };

    $scope.detail_template = {
        name: 'detail_template',
        url: '/templates/shipment_maintenance/shipment_detail.html'
    };


    $scope.choose = function(choice) {
    	$scope.search_choice = choice;
    	$scope.shipment_list = []
    	angular.forEach($scope.items, function(item) {
           	$scope.shipment_list.push(item["shipment_header"][$scope.search_choice.value]);
        });
    }

    $scope.showShipment = function(show, shipment_header_id, shipment_detail_id) {
        var url = baseUrl + '/'+ shipment_header_id 

        $http.get(url).success(function(data) {
            $scope.shipment_header = data.shipment_header
            $scope.shipment_detail = $filter('search')(data.shipment_detail, shipment_detail_id, 'id');


            if (show == 'Header') {
                $scope.header.show = true
                $scope.detail.show = false
            } else {
                $scope.detail.show = true
                $scope.header.show = false
            }

        });
        
        $scope.expand = 50;
        $scope.squeeze = 50;
        $scope.selected_header_id = shipment_header_id;
        $scope.selected_detail_id = shipment_detail_id;
    }

    $scope.hideShipment = function() {
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

    $scope.editShipment= function(header_id, detail_id) {
        var url =  baseUrl + '/edit/'+ header_id + '/'
        if(detail_id != null) {
            url += detail_id
        }
        $location.path(url);
    }

    $scope.updateHeader = function(data, el, id) {
        var url = baseUrl + '/' + id + '/update_header';
        var d = $q.defer();
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };

    $scope.updateDetail = function(data, el, id) {
    	var d = $q.defer();
        var url = baseUrl + '/' + id + '/update_detail';
        d = UserService.updateResource(data, el, id, url, $scope, d);
        return d.promise;
    };

    $scope.init = function() {

        var url = baseUrl + '?client=' + app_parameters.client + '&warehouse='+ app_parameters.warehouse;
        

        $http.get(url).success(function(data) {
            $scope.items = data;
            $scope.shipment_list = []

            $scope.filter_from_object = "shipment_header"
            $scope.filter_from_field = "record_status"

            UserService.set_page($scope);
			
            $scope.status(null);
			
			
            angular.forEach($scope.items, function(item) {
                $scope.shipment_list.push(item["shipment_header"][$scope.search_choice.value]);
            });
			
        });

    };

    $scope.init();
});
