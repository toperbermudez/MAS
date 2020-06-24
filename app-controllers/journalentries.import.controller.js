(function () {
    'use strict';

    angular.module('app').controller('JEImportController', Controller);


    Controller.$inject = ['MasterDataService', 'JEImportService','$scope', '$filter', '$ngConfirm', 'toastr','$localStorage','serviceBasePath'];
    function Controller(mds, jes, scope, filter, confirm, toastr, storage,path) {

        scope.getTemplate = function() {
            window.open(path + 'api/journalentries/import/template', '_blank');
        }

        scope.save = function() {
            if (scope.data == null || scope.data.headers == 0) {
                toastr.warning('Data not found.');
            } else {                
                confirm({
                    theme: 'material',
                    icon: 'fa fa-question-circle', //CHANGE ICON
                    closeIcon: true,
                    title: 'Confirmation', //CHANGE TITLE
                    content: 'Save Record(s)?', //CHANGE MESSAGE
                    escapeKey: 'close',
                    buttons: {
                        confirm: {
                            keys: ['enter'],
                            btnClass: 'btn-blue', //CHANGE COLOR
                            action: function() {
                                //DO SOMETHING HERE
                                scope.data.main = {
                                    FileName: scope.fileName
                                };

                                jes.save(scope.data,function(response) {
                                    if(response.success) {
                                        toastr.success('Record(s) saved successfully.');
                                        scope.data = {};
                                        document.getElementById("form-info").reset();
                                    }
                                });
                            }
                        },
                        close: function() {}
                    }
                });
            }
        }

        scope.loadFile = function() {
            var excelFile = document.getElementById('file');
            var input = excelFile;
            var reader = new FileReader();

            reader.onload = function() {
                var fileData = reader.result;
                var workbook = XLSX.read(fileData, {type:'binary',cellDates:true});
                workbook.SheetNames.forEach(function(sheetName) {
                    var rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    scope.data = {};
                    scope.data.headers = [];
                    scope.data.details = rows;

                    var i = 1;
                    var num = 0;
                    scope.isValid = true;
                    scope.data.details.forEach(e => {
                        if(num == e.DocID) i++;
                        else i = 1;
                        e.LineNum = i;

                        if (i==1) {
                            scope.data.headers.push({
                                DocID: e.DocID,
                                RefDate: e.RefDate,
                                Ref1: e.Ref1,
                                Ref2: e.Ref2,
                                Ref3: e.Ref3,
                                Remarks: e.Remarks
                            });
                        }

                        if(e.TransAmt > 0) {
                            e.Debit = e.TransAmt;
                            e.Credit = 0;
                        } else {
                            e.Debit = 0;
                            e.Credit = -e.TransAmt;
                        }

                        e.Note = "";
                        e.AcctCode = 0;
                        //VALIDATIONS:
                        if(!scope.glaccounts.map(x => x.FormatCode).includes(e.GLAccount)) {
                            e.Note = "Invalid GL account.";
                            scope.isValid = false;
                        } else {
                            var index = scope.glaccounts.map(x => x.FormatCode).indexOf(e.GLAccount);
                            e.AcctCode = scope.glaccounts[index].AcctCode;
                            e.AcctName = scope.glaccounts[index].AcctName;
                            //CHECK IF GL REQUIRES EMPLOYEE CODE
                            if(scope.reqempcodes.includes(e.AcctCode)) {
                                if(!scope.employees.map(x => x.EmpCode).includes(e.EmpID)) {
                                    e.Note = "Invalid employee code.";
                                    scope.isValid = false;
                                }
                            }
                        }
                        e.RefDate = new Date(e.RefDate);
                        num = e.DocID;
                    });
                    scope.totalDebit = filter('number')(scope.data.details.map(item => item.Debit).reduce((prev, next) => prev + next),2);
                    scope.totalCredit = filter('number')(scope.data.details.map(item => item.Credit).reduce((prev, next) => prev + next),2);
                    scope.totalDiff = filter('number')((scope.totalDebit-scope.totalCredit),2);
                    scope.fileName = input.files[0].name;
                    scope.$applyAsync();

                    document.getElementById("form-file").reset();
                });
            }

            reader.readAsBinaryString(input.files[0]);
        }
        //-----------------------------------------------------------------------------------------------
        function getEmployees() {
            mds.employees(function(response) {
                scope.employees = response.data;
            });
        }

        function getGL() {
            mds.glaccounts(function(response) {
                scope.glaccounts = response.data;
            });
        }

        function getReqEmp() {
            jes.reqemp(function(response) {
                scope.reqempcodes = response.data;
            });
        }

        function init() {
            getEmployees();
            getGL();
            getReqEmp();
        };
        init();
    }

})();