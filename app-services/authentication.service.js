(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', Service)

    Service.$inject = ['$http', '$localStorage', 'toastr', 'serviceBasePath', '$httpParamSerializerJQLike', '$rootScope'];
    function Service($http, $localStorage, toastr, serviceBasePath, $httpParamSerializerJQLike, $rootScope) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;

        return service;

        function Login(username, password, callback) {
            var data = $httpParamSerializerJQLike({ username: username, password: password, grant_type: 'password' });
            var config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

            $http.post(serviceBasePath + 'token', data, config)
                .then(function (response) {
                    var token = response.data.access_token;
                    // login successful if there's a token in the response
                    if (token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        //$localStorage.currentUser = { username: username, token: token };
                        $localStorage.token = token

                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + token;

                        $rootScope.loggedIn = true;
                        SetCredentials();

                        // execute callback with true to indicate successful login
                        callback({ success: true });
                    } else {
                        $rootScope.loggedIn = false;
                        // execute callback with false to indicate failed login
                        callback({ success: false });
                    }
                }, function (response) {
                    console.log(response);
                    toastr.error(response.data.error);
                    $rootScope.loggedIn = false;
                    callback({ success: false });
                });
        }

        function SetCredentials() {
            if ($http.defaults.headers.common.Authorization !== '') {
                $http.get(serviceBasePath + "api/account/myinfo")
                    .then(function (response) {
                        $localStorage.currentUser = {
                            Dept: response.data.Dept,
                            DeptCode: response.data.DeptCode,
                            EmpID: response.data.EmpID,
                            EmpName: response.data.EmpName,
                            FName: response.data.FName,
                            SecCode: response.data.SecCode,
                            UType: response.data.UType,
                            WhsCode: response.data.WhsCode,
                            isWelcome: false
                        };
                    })
            }
        }

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $rootScope.loggedIn = false;
            $http.defaults.headers.common.Authorization = '';
        }
    }
})();