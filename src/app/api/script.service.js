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
export default angular.module('blocky.api.script', [])
    .factory('scriptService', ScriptService).name;

/*@ngInject*/
function ScriptService($http, $q, $rootScope, $filter, settings) {

    var allScripts = undefined;

    $rootScope.scriptServiceStateChangeStartHandle = $rootScope.$on('$stateChangeStart', function () {
        invalidateScriptsCache();
    });

    var service = {
        getAllScripts: getAllScripts,
        getScript: getScript,
        deleteScript: deleteScript,
        saveScript: saveScript,
        addScript: addScript,
        uploadScript: uploadScript
    }

    return service;

    function invalidateScriptsCache() {
        allScripts = undefined;
    }

    function loadScriptsCache() {
        var deferred = $q.defer();

        if (!allScripts) {
            var url = settings.baseApiUrl + '/scripts';
            $http.get(url, null).then(function success(response) {
                allScripts = response.data;
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getAllScripts() {
        var deferred = $q.defer();

        loadScriptsCache().then(
            function success() {
                deferred.resolve(allScripts);
            },
            function fail() {
                deferred.reject();
            }
        );
        return deferred.promise;
    }

    function getScript(scriptId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/scripts/' + scriptId;
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function saveScript(script) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/scripts/' + script.id;
        $http.put(url, script).then(function success(response) {
            invalidateScriptsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteScript(scriptId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/scripts/' + scriptId;
        $http.delete(url).then(function success() {
            invalidateScriptsCache();
            deferred.resolve();
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function addScript(script) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/scripts';
        $http.post(url, script).then(function success(response) {
            invalidateScriptsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function uploadScript(scriptId, deviceId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/script/' + scriptId + '/upload';
        var uploadRequest = {
            deviceId: deviceId
        };
        $http.post(url, uploadRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }
}
