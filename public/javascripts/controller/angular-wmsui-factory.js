//Intercept the authority
wms.factory('authInterceptor', function ($rootScope, $q, $window, $localStorage) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($localStorage.token) {
        config.headers.authorization = $localStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      } 
      return response || $q.when(response);
    }
  };
});



wms.factory("ShareService", function() {
    var share_shipment = {shipment_header: {} , shipment_detail: {}};

    return {

        set_shipment : function(shipment) {
            share_shipment = shipment;
        },

        get_shipment : function() {
            return share_shipment;
        }

    };

});


wms.factory('Auth', function ($rootScope, $q, $window, $http, $localStorage) {
       function urlBase64Decode(str) {
           var output = str.replace('-', '+').replace('_', '/');
           switch (output.length % 4) {
               case 0:
                   break;
               case 2:
                   output += '==';
                   break;
               case 3:
                   output += '=';
                   break;
               default:
                   throw 'Illegal base64url string!';
           }
           return window.atob(output);
       }

       function getClaimsFromToken() {
           var token = $localStorage.token;
           var user = {};
           if (typeof token !== 'undefined') {
               var encoded = token.split('.')[1];
               user = JSON.parse(urlBase64Decode(encoded));
           }
           return user;
       }

       var tokenClaims = getClaimsFromToken();

       return {

           signup: function (data, success, error) {
               $http.post('/users/signup', data).success(success).error(error);
           },
           login: function (data, success, error) {
               $http.post('/users/signin', data).success(success).error(error);
           },
           signout: function (success) {
               tokenClaims = {};
               delete $localStorage.token;
               delete $localStorage.app_parameters;
               success();
           },
           getTokenClaims: function () {
               return getClaimsFromToken();
           },
           getAppParameters: function() {
           		var app_parameters = $localStorage.app_parameters;
           		return app_parameters;
           }

       };
   });


// Set up the cache ‘myCache’
wms.factory('wmsCache', function($cacheFactory) {
 return $cacheFactory('wmsCase');
 return $cacheFactory('wmsShipment');
});


wms.factory("UserService", function($http, $filter){

    return ({

        findAndReplace:  function($scope, objId, newObj) {
            $scope.pagedItems[0].forEach(function(obj) {
                if (obj.item_header.id === objId) {
                    obj = newObj;
                }

                });
         },

        updateResource : function(data, el, id, url, $scope, d) {

        var fields_to_update = {};
        fields_to_update[el.$editable.elem[0].id] = data;
        $http.post(url, {
            'authenticity_token': $('meta[name="csrf-token"]').attr('content'),
             app_parameters: {'client': 'WM', 'warehouse': 'WH1','channel': '', 'building': ''},
            fields_to_update: fields_to_update
        })
                .success(function(res) {
                    res = res || {};
                    d.resolve();
                }).error(function(res){
                    res = res || {};
                    if (res.status == 500) {
                    	console.log('error');
                        d.reject(res.message|| 'Server Error');
                    }
                    else {
                        d.reject(res.errors[0].message);
                    }
                });
        return d;
    },

    set_page: function($scope) {

            $scope.sortingOrder = '';
            $scope.reverse = false;
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 8;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
			
			console.log('1');

            var searchMatch = function (haystack, needle) {
            	console.log('2');
                if (!needle || !haystack) {
                    return false;
                }

                if (typeof(haystack) == 'boolean') {
                    return haystack == needle;
                }

                if (typeof(haystack) == 'string') {
                    return haystack.toLowerCase().lastIndexOf(needle.toLowerCase(),0) !== -1;
                }
            };

            // Filter by status
            $scope.status = function (status) {
            	
				console.log('3');
                status = status==null ?  $scope.last_status : status;
                $scope.last_status = status;

                $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                	if (status == '*All') {
            			return true;
            		}
                	
                    if (searchMatch(item[$scope.filter_from_object][$scope.filter_from_field], status)) {
                        return true;
                    }

                    else {
                        return false;
                    }

                });
                // take care of the sorting order
                if ($scope.sortingOrder !== '') {
                    $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                }
                $scope.currentPage = 0;
                groupToPages();
            };


            // calculate page in place
            var groupToPages = function () {
            	console.log('4');
                $scope.pagedItems = [];

                for (var i = 0; i < $scope.filteredItems.length; i++) {
                    if (i % $scope.itemsPerPage === 0) {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                    } else {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                    }
                }
            };

            // init the filtered items
            $scope.search = function (event, search_field) {

                if (event.which != 13) {
                    return;
                }

                $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                    if (searchMatch(item[$scope.filter_from_object][search_field], $scope.query) &&
                            searchMatch(item[$scope.filter_from_object][$scope.filter_from_field], $scope.last_status)) {
                        return true;
                    }

                    else {
                        return false;
                    }
                });
                // take care of the sorting order
                if ($scope.sortingOrder !== '') {
                    $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                }
                $scope.currentPage = 0;
                // now group by pages
                groupToPages();
            };

            $scope.range = function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            };

            $scope.prevPage = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.pagedItems.length - 1) {
                    $scope.currentPage++;
                }
            };

            $scope.setPage = function () {
                $scope.currentPage = this.n;
            };
            
            $scope.setCurrentPage = function (n) {
            	console.log($scope.currentPage);
                $scope.currentPage = n;
            };


            // change sorting order
            $scope.sort_by = function(newSortingOrder) {
                //if ($scope.sortingOrder == newSortingOrder)
                $scope.reverse = !$scope.reverse;

                $scope.sortingOrder = 'shipment_header.'+newSortingOrder;

                // take care of the sorting order
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                $scope.currentPage = 0;
                // now group by pages
                groupToPages();
            };

        }


    }
 );
});
