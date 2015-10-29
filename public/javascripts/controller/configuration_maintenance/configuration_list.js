    wms.controller('ConfigurationListCtrl', function ($scope, $http,  $location, $filter, $q, UserService, Auth) {


        $scope.last_status = true;
        $scope.lastitem = {};
        $scope.detail  = {};
        $scope.header  = {};
        $scope.expand = 0;
        $scope.squeeze = 100;
        
        var app_parameters = Auth.getAppParameters();
    	var client = app_parameters.client;
    	var warehouse = app_parameters.warehouse;
    	baseUrl = '/configuration_maintenance';


        $scope.search_items = [
            {value: 'module', text: 'Module'},
            {value: 'key', text: 'Key'}
        ];

        $scope.options = []

        $scope.loadGroups = function(attribute1) {
            $scope.options = []
           angular.forEach(JSON.parse(attribute1).Options, function(option) {
                  $scope.options.push({value: option, text: option});
           });
        }

		$scope.search_choice = $scope.search_items[0]

        $scope.choose = function(choice) {
            $scope.search_choice = choice;
            $scope.case_list = []
            angular.forEach($scope.items, function(item) {
                $scope.case_list.push(item["configuration_header"][$scope.search_choice.value]);
            });

            $scope.case_list = $scope.case_list.filter(function (e, i, arr) {
   				return arr.lastIndexOf(e) === i;
			});
        }

        $scope.case = 'new case';


        $scope.header_template = {
            name: 'header_template',
            url: '/templates/configuration_maintenance/configuration_header.html'
        };

        $scope.detail_template = {
            name: 'detail_template',
            url: '/templates/case_maintenance/case_detail.html'
        };

        $scope.showConfiguration = function(show, configuration, configuration_detail_id) {
            var url = baseUrl + '/'+  configuration + '.json'
            $scope.data = {}
            $http.get(url).success(function(data) {
                $scope.configuration_header = data.configuration_header
                $scope.configuration_details = data.configuration_detail

                if (show == 'Header') {
                    $scope.header.show = true
                    $scope.detail.show = false
                } else {
                    $scope.detail.show = true
                    $scope.header.show = false
                    angular.forEach($scope.configuration_deatils, function (configuration_detail) {
                        if (configuration_detail.id == configuration_detail_id) {
                            $scope.configuration_detail = configuration_detail;
                        }
                    });
                }
            });

            $scope.expand = 50
            $scope.squeeze = 50
            $scope.selected_header_id = configuration
            $scope.selected_detail_id = configuration_detail_id
        }

        $scope.hideConfiguration = function() {
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

        $scope.editConfiguration= function(header_id, detail_id) {
            var url =  baseUrl + '/edit_configuration/'+ header_id + '/'
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
                $scope.case_list = []

                $scope.filter_from_object = "configuration_header"
                $scope.filter_from_field = "enable"

                UserService.set_page($scope);

                $scope.status(null);

                angular.forEach($scope.items, function(item) {
                    $scope.case_list.push(item["configuration_header"][$scope.search_choice.value]);
                });

            });

        };

        $scope.init();
    });
