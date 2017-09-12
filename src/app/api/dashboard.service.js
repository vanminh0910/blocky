/*
 * Copyright © 2017 The Blocky Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export default angular.module('blocky.api.dashboard', [])
    .factory('dashboardService', DashboardService).name;

/*@ngInject*/
function DashboardService($http, $q, $rootScope, $filter, settings) {

    var allDashboards = undefined;

    $rootScope.dashboardServiceStateChangeStartHandle = $rootScope.$on('$stateChangeStart', function () {
        invalidateDashboardsCache();
    });

    var service = {
        getAllDashboards: getAllDashboards,
        getDashboard: getDashboard,
        deleteDashboard: deleteDashboard,
        saveDashboard: saveDashboard,
        addDashboard: addDashboard,
        widgetAction: widgetAction
    }

    return service;

    function invalidateDashboardsCache() {
        allDashboards = undefined;
    }

    function loadDashboardsCache() {
        var deferred = $q.defer();

        if (!allDashboards) {
            var url = settings.baseApiUrl + '/dashboards';
            $http.get(url, null).then(function success(response) {
                allDashboards = response.data;
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getAllDashboards() {
        var deferred = $q.defer();

        loadDashboardsCache().then(
            function success() {
                deferred.resolve(allDashboards);
            },
            function fail() {
                deferred.reject();
            }
        );
        return deferred.promise;
    }

    function getDashboard(dashboardId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/dashboards/' + dashboardId;
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function saveDashboard(dashboard) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/dashboards/' + dashboard.id;
        var dashboardRequest = {
            name: dashboard.name,
            content: angular.toJson(dashboard.content),
            subscribedTopics: dashboard.subscribedTopics
        };
        $http.put(url, dashboardRequest).then(function success(response) {
            invalidateDashboardsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteDashboard(dashboardId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/dashboards/' + dashboardId;
        $http.delete(url).then(function success() {
            invalidateDashboardsCache();
            deferred.resolve();
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function addDashboard(dashboard) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/dashboards/';
        var dashboardRequest = {
            name: dashboard.name,
            content: angular.toJson(dashboard.content)
        };
        $http.post(url, dashboardRequest).then(function success(response) {
            invalidateDashboardsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function widgetAction(widget) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/dashboards/widgetAction';
        $http.post(url, widget).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

}