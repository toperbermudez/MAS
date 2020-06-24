(function () {
    'use strict';

    angular.module('app').controller('ContainerController', Controller);


    Controller.$inject = ['$scope','$localStorage','$rootScope', 'toastr'];
    function Controller($scope,local, root,toastr) {
        //scope variables
        $scope.empname = "USER";
        $scope.active_module = 'dashboard';
        $scope.set_active = set_active;
        root.loginMode = true;

        init();
        function init() {
            root.loginMode = false;
            if (local.currentUser != null) $scope.empname = local.currentUser.EmpName;
            toastr.info('Welcome back, ' + local.currentUser.FName + '!');
        };

        function set_active(module) {
            $scope.active_module = module;
        }
    }

})();