(function () {
    'use strict';

    angular.module('app').controller('CashPositionController', Controller);


    Controller.$inject = ['MasterDataService', 'CashPositionService', '$scope', '$filter', '$ngConfirm', 'toastr','$localStorage'];
    function Controller(mds, cps, scope, filter, confirm, toastr, storage) {

        scope.header = {};
        scope.detail = {};
        scope.mapping = {};
        
        //HEADER---------------------------------------------------------------------------------------------------
        scope.header.get = function() {
            cps.header.get(function (response) {
                if(response.success) {
                    scope.headers = response.data;
                }
            });
        }

        scope.header.add = function(model) {
            cps.header.add(model, function (response) {
                if (response.success) {
                    model.CPId = response.CPId;
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
                            cps.header.update(model, function (response) {
                                if (response.success) {
                                    var ix = scope.headers.map(x => x.CPId).indexOf(model.CPId);
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
                            cps.header.remove(model, function (response) {
                                if (response.success) {
                                    scope.headers = scope.headers.filter(x => x.CPId != model.CPId);
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
            cps.header.sort(scope.headers, function(response) {
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
            cps.detail.get(model.CPId,function(response){
                if(response.success) {
                    scope.details = response.data;
                }
            });
        }

        scope.detail.add = function(model) {
            cps.detail.add(model, function (response) {
                if (response.success) {
                    model.LineId = response.LineId;
                    model.Mapped = 0;
                    scope.details.push(model);
                    var ix = scope.headers.map(x => x.CPId).indexOf(model.CPId);
                    scope.headers[ix].Details += 1;
                    toastr.success('New transaction type added successfully.');
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
                            cps.detail.update(model, function (response) {
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
                            cps.detail.remove(model, function (response) {
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
            cps.detail.sort(scope.details, function(response){
                if(response.success) toastr.success('Sorting updated.');
            });
        }

        scope.modalNewDetail = function() {
            scope.detaildata = {};
            scope.detaildata.CPId = scope.headerdata.CPId;
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
            cps.mapping.get(model.CPId, model.LineId, function (response) {
                if(response.success) {
                    scope.maps = response.data;
                }
            });
            angular.element('#modal-mapping').modal('show');
        }

        scope.mapping.add = function(item,model,label) {
            item.CPId = scope.detaildata.CPId;
            item.LineId = scope.detaildata.LineId;
            cps.mapping.add(item,function(response) {
                if (response.success) {
                    item.MapId = response.MapId;
                    scope.maps.push(item);
                    var ix = scope.details.map(x => x.LineId).indexOf(item.LineId);
                    scope.details[ix].Mapped += 1;
                    toastr.success('GL account added successfully.');
                }
            });
            scope.searchGL = '';
        }

        scope.mapping.remove = function(model) {
            confirm({
                theme: 'material',
                icon: 'fa fa-times-circle', //CHANGE ICON
                closeIcon: true,
                title: 'Confirmation', //CHANGE TITLE
                content: '<span class="lead font-weight-light">Remove '+ model.AcctName +'?</span>', //CHANGE MESSAGE
                escapeKey: 'close',
                buttons: {
                    confirm: {
                        keys: ['enter'],
                        btnClass: 'btn-red', //CHANGE COLOR
                        action: function() {
                            cps.mapping.remove(model, function (response) {
                                if (response.success) {
                                    scope.maps = scope.maps.filter(x => x.AcctCode != model.AcctCode);
                                    var ix = scope.details.map(x => x.LineId).indexOf(model.LineId);
                                    scope.details[ix].Mapped += -1;
                                    toastr.success('GL account removed successfully.');
                                }
                            });
                        }
                    },
                    close: function() {}
                }
            });
        }

        //MASTERDATA------------------------------------------------------------------------------------
        var getGLAccounts = function() {
            mds.glaccounts(function (response) {
                if(response.success) {
                    scope.glaccounts = response.data;
                }
            });
        }

        //-----------------------------------------------------------------------------------------------

        function init() {
            getGLAccounts();
            scope.header.get();
        };
        init();
    }

})();