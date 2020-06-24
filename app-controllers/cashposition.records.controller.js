(function () {
    'use strict';

    angular.module('app').controller('CashPositionRecordsController', Controller);


    Controller.$inject = ['MasterDataService', 'CashPositionService', '$scope', '$filter', '$ngConfirm', 'toastr','$localStorage','serviceBasePath','$window'];
    function Controller(mds, cps, scope, filter, confirm, toastr, storage,path,window) {

        //REPORT----------------------------------------------------------------------------------------
        scope.load = function(year) {
            scope.loading = true;
            cps.report.records(year, function(response) {
                if(response.success) {
                    scope.records = response.data.map(function(e) {
                        e.BegAmt = filter('number')(e.BegAmt,2);
                        e.CurrAmt = filter('number')((e.EndAmt - e.BegAmt),2);
                        e.EndAmt = filter('number')(e.EndAmt,2);
                        e.DateCreated = filter('date')(e.DateCreated,'MMM d, y h:mm a');
                        e.Pd = scope.months.find(x => x.id == e.Pd).abbrev;
                        return e;
                    });
                }
                scope.loading = false;
            });
        }

        scope.getRecord = function(item) {
            cps.report.record(item.DocEntry, function(response) {
                if(response.success) {
                    scope.data = response.data;
                    scope.record = item;
                    scope.exportLink = path + "api/cashposition/export?docentry=" + scope.record.DocEntry;
                    scope.detailMode = true;
                }
            });
        }

        scope.remove = function(item) {
            confirm({
                theme: 'material',
                icon: 'fa fa-question-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: 'Delete record?', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-red', //CHANGE COLOR
                        action: function() {
                            //DO SOMETHING HERE
                            cps.report.remove(item, function(response) {
                                if(response.success) {
                                    scope.detailMode = false;
                                    scope.records = scope.records.filter(x => x.DocEntry != item.DocEntry);
                                    toastr.success("Record deleted successfully.");
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.export = function(item) {
            window.open(path + 'api/cashposition/export?docentry=' + item.DocEntry, '_blank');
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
                scope.load(scope.year);
            });
        }

        //MODALS-----------------------------------------------------------------------------------------
        scope.modalGL = function(item) {
            angular.element('#modal-gl').modal('show');
            scope.detail = item;
            scope.hasGL = scope.data.glaccounts.filter(x => x.CPLine == item.CPLine).length > 0;
        }
        //-----------------------------------------------------------------------------------------------

        function init() {
            getMonths();
            getYears();
        };
        init();
    }

})();