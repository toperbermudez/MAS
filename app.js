(function () {
    //init ag-grid plugin-----------------------
    agGrid.initialiseAgGridWithAngular1(angular);
    angular
        .module("app", ['ui.router', 'datatables', 'ngAnimate', 'ngMessages', 'ngStorage', 'toastr', 'cp.ngConfirm','ui.bootstrap', 'ui.sortable', 'agGrid'])
        .config(config)
        .run(run)
        //.constant('serviceBasePath', 'http://192.171.3.2/b1integration/');
        .constant('serviceBasePath', 'http://localhost:18831/');

    config.$inject = ['$stateProvider', '$urlRouterProvider']
    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        // app routes
        $stateProvider
            .state('container', {
                url: '/',
                views: {
                    '': {
                        templateUrl: 'app-views/container.view.html',
                        controller: 'ContainerController',
                    },
                    '@container': {
                        templateUrl: 'app-views/dashboard.view.html',
                        // controller: 'DashboardController',
                    }
                }
            })
            .state('container.dashboard', {
                url: 'dashboard',
                templateUrl: 'app-views/dashboard.view.html',
                // controller: 'DashboardController',
            })
            .state('container.cash_position', {
                url: 'reports/cash-position',
                templateUrl: 'app-views/cashposition.report.view.html',
                controller: 'CashPositionReportController',
            })
            .state('container.cash_position_setup', {
                url: 'reports/cash-position/setup',
                templateUrl: 'app-views/cashposition.setup.view.html',
                controller: 'CashPositionController',
            })
            .state('container.cash_position_records', {
                url: 'reports/cash-position/records',
                templateUrl: 'app-views/cashposition.records.view.html',
                controller: 'CashPositionRecordsController',
            })
            .state('container.profit_summary', {
                url: 'reports/profit-summary',
                templateUrl: 'app-views/profsumm.report.view.html',
                controller: 'ProfitSummReportController',
            })
            .state('container.profit_summary_setup', {
                url: 'reports/profit-summary/setup',
                templateUrl: 'app-views/profsumm.setup.view.html',
                controller: 'ProfitSummaryController',
            })
            .state('container.profit_summary_records', {
                url: 'reports/profit-summary/records',
                templateUrl: 'app-views/profsumm.records.view.html',
                controller: 'ProfSummRecordsController',
            })
            .state('container.je', {
                url: 'journalentries',
                templateUrl: 'app-views/journalentries.view.html',
                controller: 'JEController',
            })
            .state('container.je_import', {
                url: 'journalentries/import',
                templateUrl: 'app-views/journalentries.import.view.html',
                controller: 'JEImportController',
            })
            .state('container.je_import_records', {
                url: 'journalentries/import/records',
                templateUrl: 'app-views/journalentries.import.records.view.html',
                controller: 'JEImportRecordsController',
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app-views/login.view.html',
                controller: 'LoginController',
            });
    }

    run.$inject = ['$rootScope', '$http', '$location', '$localStorage']
    function run($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$rootScope.loggedIn) {
                $location.path('/login');
            }
        });
    }

})();