(function () {
    'use strict';

    angular.module('app').controller('ProfSummRecordsController', Controller);


    Controller.$inject = ['MasterDataService', 'ProfitSummaryService', '$scope', '$filter', '$ngConfirm', 'toastr','$localStorage','serviceBasePath','$window'];
    function Controller(mds, pss, scope, filter, confirm, toastr, storage, path, window) {

        //REPORT----------------------------------------------------------------------------------------
        scope.load = function(year) {
            scope.loading = true;
            pss.report.records(year, function(response) {
                if(response.success) {
                    scope.records = response.data.map(function(e) {
                        e.WireTransFee = filter('number')(e.WireTransFee,2);
                        e.MicroProf = filter('number')(e.MicroProf,2);
                        e.Commission = filter('number')(e.Commission,2);
                        e.CaliProf = filter('number')(e.CaliProf,2);
                        e.ImportProf = filter('number')(e.ImportProf,2);
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
                            pss.report.remove(item, function(response) {
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

        scope.update = function(item) {
            pss.report.update(item, function(response) {
                if(response.success) {
                    var ix = scope.records.map(x => x.DocEntry).indexOf(item.DocEntry);
                    scope.records[ix].Remarks = item.Remarks;
                    toastr.success("Remarks updated successfully.");
                    angular.element("#modal-edit").modal("hide");
                    scope.record = {};
                }
            });
        }

        scope.get = function(item) {
            pss.report.record(item.DocEntry, function(response) {
                if(response.success) {
                    scope.data = response.data;
                    scope.record = item;
                    scope.exportLink = path + "api/profitsumm/export?docentry=" + scope.record.DocEntry;
                    scope.detailMode = true;
                    console.log(scope.data);
                }
            });
        }

        scope.export = function(item) {
            window.open(path + 'api/profitsumm/export?docentry=' + item.DocEntry, '_blank');
        }

        scope.dtopt = {
            paging: false,
            searching: false,
            scrollX: true,  
            columnDefs: [
                { targets: 0, width: "7em" }, //action
                { targets: 1, width: "3em" }, //year
                { targets: 2, width: "3em" }, //period
                { targets: 3, width: "20em" }, //remarks
                { targets: 4, width: "10em" }, //dateposted
                { targets: 5, width: "10em" }, //postedby
            ]
        };

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
        scope.modalEdit = function(item) {
            angular.element('#modal-edit').modal('show');
            scope.record = item;
        }

        scope.modalDetails = function(item) {
            angular.element('#modal-details').modal('show');
            scope.detail = item;
            scope.hasGL = Boolean(scope.data.cashposition.filter(x => x.PSLine == item.PSLine).length > 0);
        }
        //-----------------------------------------------------------------------------------------------

        function init() {
            getMonths();
            getYears();
        };
        init();
    }

})();