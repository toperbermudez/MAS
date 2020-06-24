(function () {
    'use strict';

    angular.module('app').controller('JEController', Controller);


    Controller.$inject = ['$scope', '$filter', '$ngConfirm', 'toastr','$localStorage'];
    function Controller(scope, filter, confirm, toastr, storage) {

        //-----------------------------------------------------------------------------------------------

        function init() {
        };
        init();
    }

})();