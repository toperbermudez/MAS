(function () {
    'use strict';

    angular.module('app').controller('ProfitSummaryController', Controller);


    Controller.$inject = ['ProfitSummaryService','CashPositionService', '$scope', '$filter', '$ngConfirm', 'toastr','$localStorage'];
    function Controller(pss, cps, scope, filter, confirm, toastr, storage) {

        scope.header = {};
        scope.detail = {};
        scope.mapping = {};
        scope.report = {};

        //HEADER---------------------------------------------------------------------------------------------------
        scope.header.get = function() {
            pss.header.get(function (response) {
                if(response.success) {
                    scope.headers = response.data;
                }
            });
        }

        scope.header.add = function(model) {
            pss.header.add(model, function (response) {
                if (response.success) {
                    model.PSId = response.PSId;
                    model.Details = 0;
                    scope.headers.push(model);
                    toastr.success('New description added successfully.');
                    angular.element('#modal-header').modal('hide');
                }
            });
        }

        scope.header.update = function(model) {
            confirm({
                theme: 'material',
                icon: 'fa fa-question-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Update record?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-blue', //CHANGE COLOR
                        action: function() {
                            pss.header.update(model, function (response) {
                                if (response.success) {
                                    var ix = scope.headers.map(x => x.PSId).indexOf(model.PSId);
                                    scope.headers[ix] = model;
                                    toastr.success('Item updated successfully.');
                                    // angular.element('#modal-header').modal('hide');
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.header.remove = function(model) {
            scope.detailMode = false;
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Remove '+ model.Descrip +'?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-red', //CHANGE COLOR
                        action: function() {
                            pss.header.remove(model, function (response) {
                                if (response.success) {
                                    scope.headers = scope.headers.filter(x => x.PSId != model.PSId);
                                    toastr.success('Item removed successfully.');
                                    angular.element('#modal-header').modal('hide');
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.header.sort = function() {
            pss.header.sort(scope.headers, function(response) {
                if(response.success) toastr.success('Sorting updated.');
            });
        }

        scope.modalNewHeader = function() {
            scope.addHeaderMode = true;
            scope.headerdata = {};
            scope.headerdata.Effect = 'ADD';
            scope.detailMode = false;
            angular.element('#modal-header').modal('show');
        }

        scope.modalEditHeader = function(model) {
            scope.headerdata = model;
            scope.addHeaderMode = false;
            scope.detailMode = false;
            angular.element('#modal-header').modal('show');
        }

        scope.headerSortOpt = {
            'ui-floating': true,
            items: '.card-header',
            // placeholder: 'taskitem',
            connectWith: '.header-container',
            stop: function(e, ui) {
                scope.headers.map(function(e) {
                   e.SortId = scope.headers.indexOf(e) + 1;
                   return e; 
                });
                scope.header.sort();
            }
        };

        //DETAILS-------------------------------------------------------------------------------------
        scope.detail.get = function(model) {
            scope.detailMode = true;
            scope.headerdata = model;
            pss.detail.get(model.PSId,function(response){
                if(response.success) {
                    scope.details = response.data;
                }
            });
        }

        scope.detail.add = function(model) {
            pss.detail.add(model, function (response) {
                if (response.success) {
                    model.LineId = response.LineId;
                    model.Mapped = 0;
                    scope.details.push(model);
                    var ix = scope.headers.map(x => x.PSId).indexOf(model.PSId);
                    scope.headers[ix].Details += 1;
                    toastr.success('New item added successfully.');
                    angular.element('#modal-detail').modal('hide');
                }
            });
        }

        scope.detail.update = function(model) {
            confirm({
                theme: 'material',
                icon: 'fa fa-question-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Update record?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-blue', //CHANGE COLOR
                        action: function() {
                            pss.detail.update(model, function (response) {
                                if (response.success) {
                                    var ix = scope.details.map(x => x.LineId).indexOf(model.LineId);
                                    scope.details[ix] = model;
                                    toastr.success('Record updated successfully.');
                                    angular.element('#modal-detail').modal('hide');
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.detail.remove = function(model) {
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Remove '+ model.Descrip +'?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-red', //CHANGE COLOR
                        action: function() {
                            pss.detail.remove(model, function (response) {
                                if (response.success) {
                                    scope.details = scope.details.filter(x => x.LineId != model.LineId);
                                    toastr.success('Record removed successfully.');
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        scope.detail.sort = function() {
            pss.detail.sort(scope.details, function(response){
                if(response.success) toastr.success('Sorting updated.');
            });
        }

        scope.modalNewDetail = function() {
            scope.detaildata = {};
            scope.detaildata.PSId = scope.headerdata.PSId;
            scope.addDetailMode = true;
            angular.element('#modal-detail').modal('show');
        }

        scope.modalEditDetail = function(model) {
            scope.detaildata = model;
            scope.addDetailMode = false;
            angular.element('#modal-detail').modal('show');
        }

        scope.detailSortOpt = {
            'ui-floating': true,
            items: '.card-detail',
            // placeholder: 'taskitem',
            connectWith: '.detail-container',
            stop: function(e, ui) {
                scope.details.map(function(e) {
                    e.SortId = scope.details.indexOf(e) + 1;
                    return e; 
                 });
                scope.detail.sort();
            }
        };

        //MAPPING----------------------------------------------------------------------------------------
        scope.mapping.get = function(model) {
            scope.detaildata = model;
            pss.mapping.get(model.PSId, model.LineId, function (response) {
                if(response.success) {
                    scope.maps = response.data;
                }
            });
            scope.searchCP = '';
            angular.element('#modal-mapping').modal('show');
        }

        scope.mapping.add = function(item,model,label) {
            item.CPLine = item.LineId;
            item.PSId = scope.detaildata.PSId;
            item.LineId = scope.detaildata.LineId;

            pss.mapping.add(item,function(response) {
                if (response.success) {
                    item.MapId = response.MapId;
                    scope.maps.push(item);
                    var ix = scope.details.map(x => x.LineId).indexOf(item.LineId);
                    scope.details[ix].Mapped += 1;
                    toastr.success('New item added successfully.');
                }
            });
            scope.searchCP = '';
        }

        scope.mapping.remove = function(model) {
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Remove '+ model.Descrip +'?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-red', //CHANGE COLOR
                        action: function() {
                            pss.mapping.remove(model, function (response) {
                                if (response.success) {
                                    scope.maps = scope.maps.filter(x => x.MapId != model.MapId);
                                    var ix = scope.details.map(x => x.LineId).indexOf(model.LineId);
                                    scope.details[ix].Mapped += -1;
                                    toastr.success('Item removed successfully.');
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        //MASTERDATA-------------------------------------------------------------------------------------
        var getCP = function() {
            cps.detail.get(0, function(response) {
                if(response.success) scope.cashpositions = response.data;
            });
        }

        //-----------------------------------------------------------------------------------------------

        function init() {
            getCP();
        };
        init();
    }

})();