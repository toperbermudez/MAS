(function () {
    'use strict';

    angular.module('app').controller('ProfitSummReportController', Controller);


    Controller.$inject = ['MasterDataService', 'ProfitSummaryService', '$scope', '$filter', '$ngConfirm', 'toastr','$localStorage'];
    function Controller(mds, pss, scope, filter, confirm, toastr, storage) {

        //REPORT----------------------------------------------------------------------------------------
        scope.load = function(year,period) {
            scope.loading = true;
            scope.header = {}
            pss.report.load(year,period,function(response) {
                if(response.success) {
                    scope.data = response.data;
                    scope.header.Yr = year;
                    scope.header.Pd = period;
                    scope.title = scope.months.find(x => x.id==scope.month).name + ' ' + scope.year;
                }
                scope.loading = false;
            });
        }

        scope.post = function() {
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Post record for this period?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-blue', //CHANGE COLOR
                        action: function() {
                            pss.report.post({header: scope.header, details: scope.data.raw}, function(response) {
                                if(response.success) {
                                    toastr.success('Posting successful.');
                                    angular.element('#modal-posting').modal('hide');
                                    scope.header = {};
                                }  
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.remove = function() {
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Remove this record?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-red', //CHANGE COLOR
                        action: function() {
                            pss.report.remove(scope.header, function(response) {
                                if(response.success) {
                                    toastr.success('Record removed successfully.');
                                    scope.header = {};
                                }  
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.update = function() {
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Update remarks for this record?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-blue', //CHANGE COLOR
                        action: function() {
                            pss.report.update(scope.header, function(response) {
                                if(response.success) {
                                    toastr.success('Remarks updated successfully.');
                                    angular.element('#modal-edit').modal('hide')    ;
                                    scope.header = {};
                                }  
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        //MASTERDATA------------------------------------------------------------------------------------
        var getMonths = function() {
            mds.months(function(response) {
                scope.months = response;
                scope.month = 1;
            });
        }

        var getYears = function() {
            mds.years(function(response) {
                scope.years = response;
                scope.year = response[0];
            });
        }

        //MODALS-----------------------------------------------------------------------------------------
        scope.modalData = function(item) {
            angular.element('#modal-data').modal('show');
            scope.detail = item;
            scope.hasData = scope.data.cashposition.filter(x => x.LineId == item.LineId && x.Name != '').length > 0;
        }
        
        scope.modalPost = function() {
            if(scope.data.details == null || scope.data.details.length == 0) {
                toastr.warning('Data not found.')
            } else {
                angular.element('#modal-posting').modal('show');
            }
        }

        scope.modalEdit = function(item) {
            scope.header = item;
            angular.element('#modal-edit').modal('show');
        }
        //-----------------------------------------------------------------------------------------------

        function init() {
            getMonths();
            getYears();
        };
        init();
    }

})();