(function () {
    'use strict';

    angular.module('app').factory('JEImportService', Service);

    Service.$inject = ['$http', 'serviceBasePath', '$httpParamSerializerJQLike', '$localStorage', 'toastr'];
    function Service($http, base, serialize, $localStorage, toastr) {
        var config = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
        var config_post = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;

        var getReqEmp = function(callback) {
            $http.get(base + 'api/jeimport/reqemp', {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var save = function(model, callback) {
            $http.post(base + 'api/jeimport/save', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var remove = function(model, callback) {
            $http.post(base + 'api/jeimport/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var post = function(model, callback) {
            $http.post(base + 'api/jeimport/post', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, transid: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var cancel = function(transid, callback) {
            console.log(transid);
            $http.post(base + 'api/jeimport/cancel', serialize(transid), config_post)
                .then(function (response) {
                    callback({ success: true, transid: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var getRecords = function(callback) {
            $http.get(base + 'api/jeimport/records', {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var getRecord = function(docentry, docid, callback) {
            $http.get(base + 'api/jeimport/record?' + serialize({docentry: docentry, docid: docid}), {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var service = {
            reqemp: getReqEmp,
            save: save,
            remove: remove,
            post: post,
            cancel: cancel,
            records: getRecords,
            record: getRecord
        };

        return service;
    }
})();