(function () {
    'use strict';

    angular.module('app').factory('CashPositionService', Service);

    Service.$inject = ['$http', 'serviceBasePath', '$httpParamSerializerJQLike', '$localStorage', 'toastr'];
    function Service($http, base, serialize, $localStorage, toastr) {
        var config = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
        var config_post = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;

        //header-----------------------------------------------------
        var getHeader = function(callback) {
            $http.get(base + 'api/cashposition/header/get', {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var addHeader = function(model, callback) {
            $http.post(base + 'api/cashposition/header/add', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, CPId: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var updateHeader = function(model, callback) {
            $http.post(base + 'api/cashposition/header/update', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var removeHeader = function(model, callback) {
            $http.post(base + 'api/cashposition/header/remove?', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var sortHeader = function(model, callback) {
            $http.post(base + 'api/cashposition/header/sort', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //details-------------------------------------------------------
        var getDetail = function(cpid, callback) {
            $http.get(base + 'api/cashposition/detail/get?cpid='+cpid, {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var addDetail = function(model, callback) {
            $http.post(base + 'api/cashposition/detail/add', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var updateDetail = function(model, callback) {
            $http.post(base + 'api/cashposition/detail/update', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var removeDetail = function(model, callback) {
            $http.post(base + 'api/cashposition/detail/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var sortDetail = function(model, callback) {
            $http.post(base + 'api/cashposition/detail/sort', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //mapping-------------------------------------------------------
        var getMapping = function(cpid, lineid, callback) {
            $http.get(base + 'api/cashposition/mapping/get?'+ serialize({cpid: cpid, lineid: lineid}), {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var addMapping = function(model, callback) {
            $http.post(base + 'api/cashposition/mapping/add', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, MapId: response.data});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var removeMapping = function(model, callback) {
            $http.post(base + 'api/cashposition/mapping/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //report-------------------------------------------------------------------------------
        var load = function(year, month, callback) {
            $http.get(base + 'api/cashposition/load?' + serialize({year: year, period: month}), {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var records = function(year, callback) {
            $http.get(base + 'api/cashposition/records?year=' + year, {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var record = function(docentry, callback) {
            $http.get(base + 'api/cashposition/record?docentry=' + docentry, {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var post = function(model, callback) {
            $http.post(base + 'api/cashposition/post', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        var remove = function(model, callback) {
            $http.post(base + 'api/cashposition/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //-------------------------------------------------------------------------------------

        var header = {
            get: getHeader,
            add: addHeader,
            update: updateHeader,
            remove: removeHeader,
            sort: sortHeader
        };
        var detail = {
            get: getDetail,
            add: addDetail,
            update: updateDetail,
            remove: removeDetail,
            sort: sortDetail
        };
        
        var mapping = {
            get: getMapping,
            add: addMapping,
            remove: removeMapping
        };

        var report = {
            load: load,
            records: records,
            record: record,
            post: post,
            remove: remove,
        };

        var service = {
            header: header,
            detail: detail,
            mapping: mapping,
            report: report
        };

        return service;
    }
})();