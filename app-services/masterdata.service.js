(function () {
    'use strict';

    angular.module('app').factory('MasterDataService', Service);

    Service.$inject = ['$http', 'serviceBasePath', '$httpParamSerializerJQLike', '$localStorage', 'toastr'];
    function Service($http, base, serialize, $localStorage, toastr) {
        var config = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
        // var config_post = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        // $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;

        var service = {};
        service.glaccounts = glaccounts;
        service.months = months;
        service.years = years;
        service.getdate = getdate;
        service.employees = employees;

        return service;

        function glaccounts(callback) {
            $http.get(base + 'api/masterdata/glaccounts', {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        function employees(callback) {
            $http.get(base + 'api/masterdata/employees', {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        function months(callback) {
            callback(
            [
                {id: 1, name: 'January', abbrev: 'Jan'},
                {id: 2, name: 'February', abbrev: 'Feb'},
                {id: 3, name: 'March', abbrev: 'Mar'},
                {id: 4, name: 'April', abbrev: 'Apr'},
                {id: 5, name: 'May', abbrev: 'May'},
                {id: 6, name: 'June', abbrev: 'Jun'},
                {id: 7, name: 'July', abbrev: 'Jul'},
                {id: 8, name: 'August', abbrev: 'Aug'},
                {id: 9, name: 'September', abbrev: 'Sep'},
                {id: 10, name: 'October', abbrev: 'Oct'},
                {id: 11, name: 'November', abbrev: 'Nov'},
                {id: 12, name: 'December', abbrev: 'Dec'}
            ]);
        }

        function years(callback) {
            var years = [];

            $http.get(base + 'api/masterdata/getdate', {}, config)
            .then(function (response) {
                var yr = new Date(response.data).getFullYear();
                for (var i = yr; i >= 2019; i--) years.push(i)
                callback(years);
            })

        }

        function getdate() {
            $http.get(base + 'api/masterdata/getdate', {}, config)
            .then(function (response) {
                return response.data;
            })
        }
    }
})();