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
import blockyApiLogin from './login.service';

export default angular.module('blocky.api.user', [blockyApiLogin])
    .factory('userService', UserService)
    .name;

/*@ngInject*/
function UserService($http, $q, $rootScope, loginService, toast, store, jwtHelper, $translate, $state, settings, $log) {
    var currentUser = null,
        userLoaded = false;

    var service = {
        isAuthenticated: isAuthenticated,
        getCurrentUser: getCurrentUser,
        getUser: getUser,
        isUserLoaded: isUserLoaded,
        saveUser: saveUser,
        setUserFromJwtToken: setUserFromJwtToken,
        clearJwtToken: clearJwtToken,
        isJwtTokenValid: isJwtTokenValid,
        validateJwtToken: validateJwtToken,
        updateAuthorizationHeader: updateAuthorizationHeader,
        gotoDefaultPlace: gotoDefaultPlace,
        logout: logout,
        reloadUser: reloadUser,
        updateDefaultDashboard: updateDefaultDashboard,
        changeAuthKey: changeAuthKey
    }

    reloadUser();

    return service;

    function reloadUser() {
        userLoaded = false;
        loadUser().then(function success() {
            notifyUserLoaded();
        }, function fail() {});
    }

    function updateAndValidateToken(token, prefix, notify) {
        var valid = false;
        var tokenData = jwtHelper.decodeToken(token);
        var issuedAt = tokenData.iat;
        var expTime = tokenData.exp;
        if (issuedAt && expTime) {
            var ttl = expTime - issuedAt;
            if (ttl > 0) {
                var clientExpiration = new Date().valueOf() + ttl * 1000;
                store.set(prefix, token);
                store.set(prefix + '_expiration', clientExpiration);
                valid = true;
            }
        }
        if (!valid && notify) {
            $rootScope.$broadcast('unauthenticated');
        }
    }

    function clearTokenData() {
        store.remove('jwt_token');
        store.remove('jwt_token_expiration');
    }

    function setUserFromJwtToken(jwtToken, notify, doLogout) {
        currentUser = null;
        if (!jwtToken) {
            clearTokenData();
            if (notify) {
                $rootScope.$broadcast('unauthenticated', doLogout);
            }
        } else {
            updateAndValidateToken(jwtToken, 'jwt_token', true);
            if (notify) {
                loadUser().then(function success() {
                    $rootScope.$broadcast('authenticated');
                    notifyUserLoaded();
                }, function fail() {
                    $rootScope.$broadcast('unauthenticated');
                });
            } else {
                loadUser();
            }
        }
    }

    function isAuthenticated() {
        return isJwtTokenValid();
    }

    function logout() {
        clearJwtToken(true);
        userLoaded = false;
    }

    function clearJwtToken(doLogout) {
        setUserFromJwtToken(null, true, doLogout);
    }

    function isJwtTokenValid() {
        return isTokenValid('jwt_token');
    }

    function isTokenValid(prefix) {
        var clientExpiration = store.get(prefix + '_expiration');
        return clientExpiration && clientExpiration > new Date().valueOf();
    }

    function validateJwtToken() {
        var deferred = $q.defer();
        if (!isTokenValid('jwt_token')) {
            clearJwtToken(false);
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getCurrentUser() {
        return currentUser;
    }

    function isUserLoaded() {
        return userLoaded;
    }

    function loadUser() {

        var deferred = $q.defer();

        function procceedJwtTokenValidate() {
            validateJwtToken().then(function success() {
                var jwtToken = store.get('jwt_token');
                currentUser = jwtHelper.decodeToken(jwtToken).user;
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        }

        if (!currentUser) {
            procceedJwtTokenValidate();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function notifyUserLoaded() {
        $log.log('notifyUserLoaded');
        userLoaded = true;
        $rootScope.$broadcast('userLoaded');
    }

    function updateAuthorizationHeader(headers) {
        var jwtToken = store.get('jwt_token');
        if (jwtToken) {
            headers['Authorization'] = 'JWT ' + jwtToken;
        }
        return jwtToken;
    }

    function saveUser(user) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/users/profile';
        $http.post(url, user).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function getUser() {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/users/profile';
        $http.get(url).then(function success(response) { // TODO: replace PUT by GET
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function userHasDefaultDashboard() {
        return false;
    }

    function gotoDefaultPlace(params) {
        if (currentUser && isAuthenticated()) {
            var place = 'home.codelab';
            if (userHasDefaultDashboard()) {
                place = 'home.dashboard';
            }
            $state.go(place, params);
        } else {
            $state.go('home.codelab', params);
        }
    }

    function updateDefaultDashboard() {
        // TODO
    }

    function changeAuthKey() {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/users/changeAuthKey';
        $http.post(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

}