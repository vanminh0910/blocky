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
export default angular.module('blocky.api.device', [])
    .factory('deviceService', DeviceService).name;

/*@ngInject*/
function DeviceService($http, $q, $rootScope, $filter, settings) {

    var allDevices = undefined;

    $rootScope.deviceServiceStateChangeStartHandle = $rootScope.$on('$stateChangeStart', function () {
        invalidateDevicesCache();
    });

    var service = {
        getAllDevices: getAllDevices,
        getDevice: getDevice,
        deleteDevice: deleteDevice,
        saveDevice: saveDevice,
        loadAPList: loadAPList,
        postToBlocky: postToBlocky,
    }

    return service;

    function invalidateDevicesCache() {
        allDevices = undefined;
    }

    function loadDevicesCache() {
        var deferred = $q.defer();
        if (!allDevices) {
            var url = settings.baseApiUrl + '/devices';
            $http.get(url, null).then(function success(response) {
                allDevices = response.data;
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getAllDevices() {
        var deferred = $q.defer();

        loadDevicesCache().then(
            function success() {
                deferred.resolve(allDevices);
            },
            function fail() {
                deferred.reject();
            }
        );
        return deferred.promise;
    }

    function getDevice(deviceId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/devices/' + deviceId;
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function saveDevice(device) { // Rename only
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/devices/' + device.id;
        $http.put(url, device).then(function success(response) {
            invalidateDevicesCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteDevice(deviceId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/devices/' + deviceId;
        $http.delete(url).then(function success() {
            invalidateDevicesCache();
            deferred.resolve();
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function loadAPList() {
        var deferred = $q.defer();
        var url = settings.localApiUrl + '/aplist';
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function postToBlocky(url) {
        var deferred = $q.defer();
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }
}