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
export default angular.module('blocky.api.login', [])
    .factory('loginService', LoginService)
    .name;

/*@ngInject*/
function LoginService($http, $q, settings, $log) {

    var service = {
        signUp: signUp,
        login: login,
        changePassword: changePassword,
        resetPassword: resetPassword,
        forgotPassword: forgotPassword,
    }

    return service;

    function login(user) {
        var deferred = $q.defer();
        var loginRequest = {
            email: user.name,
            password: user.password
        };
        var url = settings.baseApiUrl + '/users/login';
        $http.post(url, loginRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function signUp(user) {
        var deferred = $q.defer();
        var signUpRequest = {
            name: user.name,
            email: user.email,
            password: user.password
        };
        var url = settings.baseApiUrl + '/users/signup';
        $http.post(url, signUpRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function changePassword(currentPassword, newPassword) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/users/password';
        var changePasswordRequest = {
            password: currentPassword,
            newPassword: newPassword
        }
        $http.post(url, changePasswordRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function forgotPassword(email) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/users/forgotPassword';
        var forgotPasswordRequest = {
            email: email
        }
        $log.log('call forgot');
        $http.post(url, forgotPasswordRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail(error) {
            $log.log(error);
            deferred.reject();
        });
        return deferred.promise;
    }

    function resetPassword(token, newPassword) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/users/resetPassword';
        var resetPasswordRequest = {
            token: token,
            newPassword: newPassword
        }
        $http.post(url, resetPasswordRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }
}