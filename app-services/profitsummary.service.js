(function () {
    'use strict';

    angular.module('app').factory('ProfitSummaryService', Service);

    Service.$inject = ['$http', 'serviceBasePath', '$httpParamSerializerJQLike', '$localStorage', 'toastr'];
    function Service($http, base, serialize, $localStorage, toastr) {
        var config = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
        var config_post = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;

        var service = {};
        var header = {};
        var detail = {};
        var mapping = {};
        var report = {};
        
        //header-----------------------------------------------------
        header.get = function(callback) {
            $http.get(base + 'api/profitsumm/header/get', {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        header.add = function(model, callback) {
            $http.post(base + 'api/profitsumm/header/add', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, PSId: response.data});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        header.update = function(model, callback) {
            $http.post(base + 'api/profitsumm/header/update', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        header.remove = function(model, callback) {
            $http.post(base + 'api/profitsumm/header/remove?', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        header.sort = function(model, callback) {
            $http.post(base + 'api/profitsumm/header/sort', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //details-------------------------------------------------------
        detail.get = function(psid, callback) {
            $http.get(base + 'api/profitsumm/detail/get?psid='+psid, {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        detail.add = function(model, callback) {
            $http.post(base + 'api/profitsumm/detail/add', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, LineId: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        detail.update = function(model, callback) {
            $http.post(base + 'api/profitsumm/detail/update', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        detail.remove = function(model, callback) {
            $http.post(base + 'api/profitsumm/detail/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        detail.sort = function(model, callback) {
            $http.post(base + 'api/profitsumm/detail/sort', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //mapping-------------------------------------------------------
        mapping.get = function(psid, lineid, callback) {
            $http.get(base + 'api/profitsumm/mapping/get?'+ serialize({psid: psid, lineid: lineid}), {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        mapping.add = function(model, callback) {
            $http.post(base + 'api/profitsumm/mapping/add', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true, MapId: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        mapping.remove = function(model, callback) {
            $http.post(base + 'api/profitsumm/mapping/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true});
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        //report-----------------------------------------------------------------------
        report.load = function(year,period,callback) {
            $http.get(base + 'api/profitsumm/load?'+ serialize({year: year, period: period}), {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        report.post = function(model, callback) {
            $http.post(base + 'api/profitsumm/post', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        report.remove = function(model, callback) {
            $http.post(base + 'api/profitsumm/remove', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        report.update = function(model, callback) {
            $http.post(base + 'api/profitsumm/update', serialize(model), config_post)
                .then(function (response) {
                    callback({ success: true });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        report.records = function(year, callback) {
            $http.get(base + 'api/profitsumm/records?year=' + year, {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        report.record = function(docentry, callback) {
            $http.get(base + 'api/profitsumm/record?docentry=' + docentry, {}, config)
                .then(function (response) {
                    callback({ success: true, data: response.data });
                },
                function (response) {
                    toastr.error(response.data);
                    callback({ success: false });
                })
        }

        service.header = header;
        service.detail = detail;
        service.mapping = mapping;
        service.report = report;
        return service;
    }
})();