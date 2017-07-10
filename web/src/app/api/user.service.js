/*
 * Copyright © 2016-2017 The Blocky Authors
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
import blockyApiLogin  from './login.service';
import angularStorage from 'angular-storage';

export default angular.module('blocky.api.user', [blockyApiLogin,
    angularStorage])
    .factory('userService', UserService)
    .name;

/*@ngInject*/
function UserService($http, $q, $rootScope, loginService, toast, store, jwtHelper, $translate, $state, types) {
    var currentUser = null,
        userLoaded = false;

    var service = {
        deleteUser: deleteUser,
        getAuthority: getAuthority,
        isAuthenticated: isAuthenticated,
        getCurrentUser: getCurrentUser,
        getUser: getUser,
        getTenantAdmins: getTenantAdmins,
        isUserLoaded: isUserLoaded,
        saveUser: saveUser,
        sendActivationEmail: sendActivationEmail,
        setUserFromJwtToken: setUserFromJwtToken,
        getJwtToken: getJwtToken,
        clearJwtToken: clearJwtToken,
        isJwtTokenValid : isJwtTokenValid,
        validateJwtToken: validateJwtToken,
        updateAuthorizationHeader: updateAuthorizationHeader,
        gotoDefaultPlace: gotoDefaultPlace,
        logout: logout,
        reloadUser: reloadUser
    }

    reloadUser();

    return service;

    function reloadUser() {
        userLoaded = false;
        loadUser().then(function success() {
            notifyUserLoaded();
        }, function fail() {
            notifyUserLoaded();
        });
    }

    function updateAndValidateToken(token, prefix, notify) {
        var valid = false;
        var tokenData = jwtHelper.decodeToken(token);
        var issuedAt = tokenData.iat;
        var expTime = tokenData.exp;
        if (issuedAt && expTime) {
            var ttl = expTime - issuedAt;
            if (ttl > 0) {
                var clientExpiration = new Date().valueOf() + ttl*1000;
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
                }, function fail() {
                    $rootScope.$broadcast('unauthenticated');
                });
            } else {
                loadUser();
            }
        }
    }

    function isAuthenticated() {
        return store.get('jwt_token');
    }

    function getJwtToken() {
        return store.get('jwt_token');
    }

    function logout() {
        clearJwtToken(true);
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

    function getAuthority() {
        if (currentUser) {
            return currentUser.authority;
        } else {
            return '';
        }
    }

    function isUserLoaded() {
        return userLoaded;
    }

    function loadUser() {

        var deferred = $q.defer();

        function procceedJwtTokenValidate() {
            validateJwtToken().then(function success() {
                var jwtToken = store.get('jwt_token');
                currentUser = jwtHelper.decodeToken(jwtToken);
                if (currentUser) {
                    var roleId = currentUser._doc.role;
                    if (roleId === "0") {
                        currentUser.authority = "TENANT_ADMIN";
                    } else if (roleId === "1") {
                        currentUser.authority = "SYS_ADMIN";
                    } else {
                        currentUser.authority = "ANONYMOUS";
                    }
                }
                if (currentUser._doc._id) {
                    getUser(currentUser._doc._id).then(
                        function success() {
                            $rootScope.forceFullscreen = false;
                            deferred.resolve();
                        },
                        function fail() {
                            deferred.reject();
                        }
                    )
                } else {
                    deferred.reject();
                }
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
        if (!userLoaded) {
            userLoaded = true;
            $rootScope.$broadcast('userLoaded');
        }
    }

    function updateAuthorizationHeader(headers) {
        var jwtToken = store.get('jwt_token');
        if (jwtToken) {
            headers['Authorization'] = 'JWT ' + jwtToken;
        }
        return jwtToken;
    }

    function getTenantAdmins(tenantId, pageLink) {
        var deferred = $q.defer();
        var url = '/api/tenant/' + tenantId + '/users?limit=' + pageLink.limit;
        if (angular.isDefined(pageLink.textSearch)) {
            url += '&textSearch=' + pageLink.textSearch;
        }
        if (angular.isDefined(pageLink.idOffset)) {
            url += '&idOffset=' + pageLink.idOffset;
        }
        if (angular.isDefined(pageLink.textOffset)) {
            url += '&textOffset=' + pageLink.textOffset;
        }
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function saveUser(user) {
        var deferred = $q.defer();
        var url = '/api/user';
        $http.post(url, user).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function getUser(userId) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/user/' + userId;
        $http.put(url).then(function success(response) { //TODO: replace PUT by GET
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = $q.defer();
        var url = '/api/user/' + userId;
        $http.delete(url).then(function success() {
            deferred.resolve();
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function sendActivationEmail(email) {
        var deferred = $q.defer();
        var url = '/api/user/sendActivationMail?email=' + email;
        $http.post(url, null).then(function success(response) {
            deferred.resolve(response);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function gotoDefaultPlace(params) {
        if (currentUser && isAuthenticated()) {
            var place = 'home.landing';
            $state.go(place, params);
        } else {
            $state.go('login', params);
        }
    }

}
