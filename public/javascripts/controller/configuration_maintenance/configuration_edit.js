wms.controller('ConfigurationEditCtrl', function ($scope, $filter, $http, $location, $q, $stateParams, UserService, Auth) {

  var app_parameters = Auth.getAppParameters()
  var client    = app_parameters.client;
  var warehouse = app_parameters.warehouse
  var baseUrl = '/configuration_maintenance'	
  
  
    var configuration_id = $stateParams.header_id
    var url = baseUrl + '/' + configuration_id + '.json?client=' + client;


    $http.get(url).
            success(function (data) {
                console.log('Call worked')
                $scope.configuration_header = data.configuration_header;
            })
            .error(function () {
                console.log('Call failed')
            });

    $scope.statuses = [
        {value: 'Active', text: 'Active'},
        {value: 'Inactive', text: 'Inactive'}
    ];

    $scope.options = []

    $scope.loadGroups = function(attribute1) {
        $scope.options = []
        angular.forEach(JSON.parse(attribute1).Options, function(option) {
            $scope.options.push({value: option, text: option});
        });
    }

    $scope.concept = [
        {value: 'AB', text: 'AB'},
        {value: 'BC', text: 'BC'},
    ];
    $scope.header_template = {
        name: 'header_template',
        url: '/templates/configuration_maintenance/configuration_header.html'
        };


    $scope.updateHeader = function(data, el, id) {

        var warehouse = $location.search().warehouse;
        var configuration  =  $location.search().configuration;
        var client    = $location.search().client;
        var fields_to_update = {};
        var url = baseUrl + '/'+ id
        fields_to_update[el.$editable.elem[0].id] = data;
        var d = $q.defer();
        $http.post(url, {
            'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
            app_parameters: app_parameters,
            fields_to_update: fields_to_update
        })
                .success(function(res) {
                    res = res || {};
                    d.resolve();
                }).error(function(res){
                    res = res || {};
                    if (res.status == 500) {
                        d.reject(res.message|| 'Server Error');
                    }
                    else {
                        d.reject(res.errors[0].message);

                    }
                });
        return d.promise;
    };


    $scope.ok = function () {
        $location.path(baseUrl)
    };

});
