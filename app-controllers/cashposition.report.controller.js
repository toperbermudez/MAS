(function () {
    'use strict';

    angular.module('app').controller('CashPositionReportController', Controller);


    Controller.$inject = ['MasterDataService', 'CashPositionService', '$scope', '$filter', '$ngConfirm', 'toastr','$localStorage'];
    function Controller(mds, cps, scope, filter, confirm, toastr, storage) {

        //REPORT----------------------------------------------------------------------------------------
        scope.load = function(year,period) {
            scope.loading = true;
            cps.report.load(year,period,function(response) {
                if(response.success) {
                    scope.record = response.data.record;
                    scope.headers = response.data.headers;
                    scope.details = response.data.details;
                    scope.data = response.data.data;
                    scope.glaccounts = response.data.glaccounts;
                    scope.record.CurrAmt = scope.headers.map(x => x.Total).reduce((prev, next) => prev + next);
                    scope.record.EndAmt = scope.record.BegAmt + scope.record.CurrAmt;

                    scope.begamt = filter('number')(scope.record.BegAmt,2);
                    scope.curramt = filter('number')(scope.record.CurrAmt,2);
                    scope.endamt = filter('number')(scope.record.EndAmt,2);
                    scope.title = scope.months.find(x => x.id==scope.record.Pd).name + ' ' + scope.record.Yr;
                }
                scope.loading = false;
            });
        }

        scope.record = function(docentry) {
            scope.loading = true;
            cps.report.records(docentry, function(response) {
                if(response.success) scope.record = response.data;
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
                            cps.report.post({header: scope.record, details: scope.data}, function(response) {
                                if(response.success) {
                                    toastr.success('Posting successful.');
                                    angular.element('#modal-posting').modal('hide');
                                    scope.record.Remarks = '';
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
        scope.modalGL = function(item) {
            angular.element('#modal-gl').modal('show');
            scope.detail = item;
            scope.hasGL = scope.glaccounts.filter(x => x.CPLine == item.CPLine).length > 0;
        }

        scope.modalPost = function() {
            if(scope.details == null || scope.details.length == 0) {
                toastr.warning('Data not found.')
            } else {
                angular.element('#modal-posting').modal('show');
            }
        }

        //-----------------------------------------------------------------------------------------------

        function init() {
            getMonths();
            getYears();
        };
        init();
    }

})();