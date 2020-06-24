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
            if(username == 'admin' && password == '1234') {
                $rootScope.loggedIn = true;
                // execute callback with true to indicate successful login
                SetCredentials();
                callback({ success: true });
            } else {
                toastr.error('Login failed.');
                $rootScope.loggedIn = false;
                callback({ success: false });
            }
        }

        function SetCredentials() {
            $localStorage.currentUser = {
                Dept: 'IT',
                DeptCode: 1,
                EmpID: '16115297',
                EmpName: 'Christopher Bermudez',
                FName: 'Christopher',
                SecCode: 0,
                UType: 'ADMIN',
                WhsCode: '00',
                isWelcome: false
            };
        }

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $rootScope.loggedIn = false;
        }
    }
})();