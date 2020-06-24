(function () {
    'use strict';

    angular.module('app').controller('JEImportRecordsController', Controller);


    Controller.$inject = ['MasterDataService', 'JEImportService','$scope', '$filter', '$ngConfirm', 'toastr','$localStorage','serviceBasePath'];
    function Controller(mds, jes, scope, filter, confirm, toastr, storage,path) {

        scope.getrecords = function() {
            jes.records(function(response) {
                if(response.success) scope.records = response.data.map(function(e) {
                    e.Selected = false;
                    return e;
                });
            });
        }

        //-----------------------------------------------------------------------------------MODALS
        scope.modalDetail= function(item) {
            jes.record(item.DocEntry, item.DocID, function(response) {
                if(response.success) {
                    scope.record = item;
                    scope.record.RefDate = filter('date')(scope.record.RefDate,'yyyy-MM-dd');
                    scope.record.details = response.data;
                    scope.sum_debit = filter('number')(scope.record.details.map(item => item.Debit).reduce((prev, next) => prev + next),2);
                    scope.sum_credit = filter('number')(scope.record.details.map(item => item.Credit).reduce((prev, next) => prev + next),2);
                    angular.element("#modal-detail").modal("show");
                }
            });
        }

        scope.post = function() {
            if(scope.records.filter(x => x.Selected).length == 0) {
                toastr.warning("No data selected.");
            } else {
                confirm({
                    theme: 'material',
                    icon: 'fa fa-question-circle', //CHANGE ICON
                    closeIcon: true,
                    title: 'Confirmation', //CHANGE TITLE
                    content: '<span class="lead font-weight-light">Post selected record(s)?</span>', //CHANGE MESSAGE
                    escapeKey: 'close',
                    buttons: {
                        confirm: {
                            keys: ['enter'],
                            btnClass: 'btn-blue', //CHANGE COLOR
                            action: function() {
                                scope.records.filter(x => x.Selected).forEach(item => {
                                    jes.post(item, function(response) {
                                        if(response.success) {
                                            item.TransID = response.transid;
                                        }
                                    }); 
                                });
                            }
                        },
                        close: function() {}
                    }
                });
            }
        }

        scope.delete = function() {
            if(scope.records.filter(x => x.Selected).length == 0) {
                toastr.warning("No data selected.");
            } else {
                confirm({
                    theme: 'material',
                    icon: 'fa fa-question-circle', //CHANGE ICON
                    closeIcon: true,
                    title: 'Confirmation', //CHANGE TITLE
                    content: '<span class="lead font-weight-light">Delete selected record(s)?</span>', //CHANGE MESSAGE
                    escapeKey: 'close',
                    buttons: {
                        confirm: {
                            keys: ['enter'],
                            btnClass: 'btn-blue', //CHANGE COLOR
                            action: function() {
                                jes.remove(scope.records.filter(x => x.Selected), function(response) {
                                    if(response.success) {
                                        toastr.success("Record(s) deleted successfully.");
                                        scope.records = scope.records.filter(x => !x.Selected);
                                    }
                                });
                            }
                        },
                        close: function() {}
                    }
                });
            }

        }

        scope.reverse = function() {
            if(scope.records.filter(x => x.Selected).length == 0) {
                toastr.warning("No data selected.");
            } else {
                scope.loading = true;
                confirm({
                    theme: 'material',
                    icon: 'fa fa-question-circle', //CHANGE ICON
                    closeIcon: true,
                    title: 'Confirmation', //CHANGE TITLE
                    content: '<span class="lead font-weight-light">Cancel posting of selected record(s)?</span>', //CHANGE MESSAGE
                    escapeKey: 'close',
                    buttons: {
                        confirm: {
                            keys: ['enter'],
                            btnClass: 'btn-red', //CHANGE COLOR
                            action: function() {
                                scope.records.filter(x => x.Selected).forEach(item => {
                                    jes.cancel(item.TransID, function(response) {
                                        if(response.success) {
                                            item.TransID = "";
                                        }
                                    }); 
                                });
                            }
                        },
                        close: function() {}
                    }
                });
            }
        }

        //-----------------------------------------------------------------------------------------------

        function init() {
            scope.getrecords();
        };
        init();
    }

})();