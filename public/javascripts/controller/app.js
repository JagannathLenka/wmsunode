var wms = angular.module('WMSUI', ['ngRoute' , 'ngStorage', 'xeditable', 'ui.bootstrap', 'ui.router']);
var login = angular.module('login', ['ngRoute', 'ngStorage', 'ui.bootstrap']);


wms.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});


// configure our routes
wms.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/main');

    $stateProvider
    
        // route for the shipment page
        .state('main', {
            url:         '/main'
        })
        
//===============================SHIPMENT PAGE============================================//
        // route for the shipment page
            .state('shipment_maintenance', {
                url:         '/shipment_maintenance',
                templateUrl: '/templates/shipment_maintenance/index.html',
                controller:  'ShipmentListCtrl'
            })

        // edit shipment header page
            .state('edit_shipment_header', {
                url:         '/shipment_maintenance/edit/:header_id/',
                templateUrl: '/templates/shipment_maintenance/show_header.html',
                controller:  'ShipmentEditCtrl'
            })

        // edit the shipment detail page
            .state('edit_shipment_detail', {
                url:         '/shipment_maintenance/edit/:header_id/:detail_id',
                templateUrl: 'templates/shipment_maintenance/show_detail.html',
                controller:  'ShipmentEditCtrl'
            })

           // route for the add shipment header
            .state('add_shipment_header', {
                url        : '/shipment_maintenance/add/header',
                templateUrl: '/templates/shipment_maintenance/add_header.html',
                controller : 'ShipmentAddCtrl'
            })

        // route for the shipment detail page
            .state('add_shipment_detail', {
                url:         '/shipment_maintenance/add/detail/:to_shipment_header_id',
                templateUrl: '/templates/shipment_maintenance/add_detail.html',
                controller:  'ShipmentAddCtrl'
            })

//===============================CASE PAGE============================================//
        // route for the case page
            .state('case_maintenance', {
                url:         '/case_maintenance',
                templateUrl: '/templates/case_maintenance/index.html',
                controller:  'CaseListCtrl'
            })

        // edit case header page
            .state('edit_case_header', {
                url:         '/case_maintenance/edit/:header_id/',
                templateUrl: '/templates/case_maintenance/show_header.html',
                controller:  'CaseEditCtrl'
            })

        // edit the case detail page
            .state('edit_case_detail', {
                url:         '/case_maintenance/edit/:header_id/:detail_id',
                templateUrl: '/templates/case_maintenance/show_detail.html',
                controller:  'CaseEditCtrl'
            })

        // route for the add case header
            .state('add_case_header', {
                url        : '/case_maintenance/add/header',
                templateUrl: '/templates/case_maintenance/add_header.html',
                controller : 'CaseAddCtrl'
            })

        // route for the case detail page
            .state('add_case_detail', {
                url:         '/case_maintenance/add/detail/:to_case_header_id',
                templateUrl: '/templates/case_maintenance/add_detail.html',
                controller:  'CaseAddCtrl'
            })

//===============================ITEM PAGE============================================//

        // route for the item master page
            .state('item_master_maintenance', {
                url:         '/item_master_maintenance',
                templateUrl: '/templates/item_maintenance/index.html',
                controller:  'ItemMasterListCtrl'
            })

        // edit item master header page
            .state('item_master_header', {
                url:         '/item_master_maintenance/edit/:header_id/',
                templateUrl: '/templates/item_maintenance/show_header.html',
                controller:  'ItemMasterEditCtrl'
            })

        // route for the add item master
            .state('add_item_master', {
                url        : '/item_master_maintenance/add',
                templateUrl: '/templates/item_maintenance/add_item.html',
                controller : 'ItemMasterAddCtrl'
            })

//===============================LOCATTION PAGE============================================//

        // route for the location master page
            .state('location_master_maintenance', {
                url:         '/location_master_maintenance',
                templateUrl: '/templates/location_maintenance/index.html',
                controller:  'LocationMasterListCtrl'
            })

        // edit item master header page
            .state('location_master_header', {
                url:         '/location_master_maintenance/edit/:header_id/',
                templateUrl: '/templates/location_maintenance/show_header.html',
                controller:  'LocationMasterEditCtrl'
            })

        // route for the add item master
            .state('location_item_master', {
                url        : '/location_master_maintenance/add',
                templateUrl: '/templates/location_maintenance/add_location.html',
                controller : 'LocationMasterAddCtrl'
            }) 


//===============================CONFIGURATION PAGE============================================//

        // route for the configuration master page
            .state('configuration_maintenance', {
                url:         '/configuration_maintenance',
                templateUrl: '/templates/configuration_maintenance/index.html',
                controller:  'ConfigurationListCtrl'
            })

        // edit configuration page
            .state('edit_configuration_header', {
                url:         '/configuration_maintenance/edit_configuration/:header_id/',
                templateUrl: '/templates/configuration_maintenance/show_header.html',
                controller:  'ConfigurationEditCtrl'
            })

        // route for adding new configuration
            .state('add_configuration_header', {
                url        : '/configuration_maintenance/add_configuration',
                templateUrl: '/templates/configuration_maintenance/add_configuration.html',
                controller : 'ConfigurationAddCtrl'
            })
            
//===============================USER PAGE============================================//            
        // route for the user master page
            .state('user_master_maintenance', {
                url:         '/user_master_maintenance',
                templateUrl: '/templates/user_maintenance/index.html',
                controller:  'UserMasterListCtrl'
            })
       
       // edit user master header page
            .state('edit_user_master', {
                url:         '/user_master_maintenance/edit/:header_id/',
                templateUrl: '/templates/user_maintenance/show_header.html',
                controller:  'UserMasterEditCtrl'
            })

        // route for the add user master
            .state('add_user_master', {
                url        : '/user_master_maintenance/add',
                templateUrl: '/templates/user_maintenance/add_user.html',
                controller : 'UserMasterAddCtrl'
            })



});

//Check if the user is logged in or not
wms.run(function($rootScope, $state, $localStorage, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
       if(! $localStorage.token) {

         //window.location = '/login'
    	}
    	
    	});
});



wms.config(function ($httpProvider) {
   $httpProvider.interceptors.push('authInterceptor');
});

wms.filter('search', function() {
    return function(array_of_objects, expected_value, search_by ) {
        var i =0;
        for (; i < array_of_objects.length ; i++) {
            if (array_of_objects[i][search_by] == expected_value) {
                return array_of_objects[i];
            }
        }
    }
});
