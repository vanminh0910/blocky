/*
 * Copyright © 2016-2017 The Thingsdashboard Authors
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
export default angular.module('thingsdashboard.api.dashboard', [])
    .factory('dashboardService', DashboardService).name;

/*@ngInject*/
function DashboardService($http, $q, $rootScope, $filter, types, utils, userService) {

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
            var user = userService.getCurrentUser();
            var userId = user._doc._id;
            var url = types.baseApiUrl + '/user/' + userId + '/dashboards';
            $http.get(url, null).then(function success(response) {
                allDashboards = response.data;
                allDashboards = $filter('orderBy')(allDashboards, ['+name', '-createdAt']);
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getAllDashboards(pageLink) {
        var deferred = $q.defer();

        loadDashboardsCache().then(
            function success() {
                utils.filterSearchTextEntities(allDashboards, 'name', pageLink, deferred);
            },
            function fail() {
                deferred.reject();
            }
        );
        return deferred.promise;
    }

    function getDashboard(dashboardId) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/dashboard/' + dashboardId;
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function saveDashboard(dashboard) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/dashboard/' + dashboard._id;
        $http.put(url, dashboard).then(function success(response) {
            invalidateDashboardsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteDashboard(dashboardId) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/dashboard/' + dashboardId;
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
        var url = types.baseApiUrl + '/dashboard/';
        $http.post(url, dashboard).then(function success(response) {
            invalidateDashboardsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function widgetAction(widget) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/dashboard/widgetAction';
        $http.post(url, widget).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

}
