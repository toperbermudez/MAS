(function () {
    'use strict';

    angular.module('app').factory('JEService', Service);

    Service.$inject = ['$http', 'serviceBasePath', '$httpParamSerializerJQLike', '$localStorage', 'toastr'];
    function Service($http, base, serialize, $localStorage, toastr) {
        var config = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
        var config_post = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;

        var post = function(model, callback) {
            $http.post(base + 'api/journalentries/post', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, transid: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var reverse = function(model, callback) {
            $http.post(base + 'api/journalentries/cancel', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, transid: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var update = function(model, callback) {
            $http.post(base + 'api/journalentries/update', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, transid: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var service = {
            post: post,
            reverse: reverse,
            update: update
        };

        return service;
    }
})();