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
/*@ngInject*/
export default function GlobalInterceptor($rootScope, $q, $injector, $log) {

    var toast;
    var translate;
    var userService;
    var settings;

    var service = {
        request: request,
        requestError: requestError,
        response: response,
        responseError: responseError
    }

    return service;

    function getToast() {
        if (!toast) {
            toast = $injector.get("toast");
        }
        return toast;
    }

    function getTranslate() {
        if (!translate) {
            translate = $injector.get("$translate");
        }
        return translate;
    }

    function getUserService() {
        if (!userService) {
            userService = $injector.get("userService");
        }
        return userService;
    }

    function getSettings() {
        if (!settings) {
            settings = $injector.get("settings");
        }
        return settings;
    }

    function isTokenBasedAuthEntryPoint(url) {
        return  url.includes('api') &&
               !url.includes(getSettings().entryPoints.login) &&
               !url.includes(getSettings().entryPoints.signup);
    }


    function request(config) {
        var rejected = false;
        if (config.url.includes('api')) {
            var isLoading = true;
            updateLoadingState(config, isLoading);
            if (isTokenBasedAuthEntryPoint(config.url)) {
                if (!getUserService().updateAuthorizationHeader(config.headers)) {
                    updateLoadingState(config, false);
                    rejected = true;
                    getUserService().clearJwtToken(false);
                    return $q.reject({ data: {message: getTranslate().instant('access.unauthorized')}, status: 401, config: config});
                } else if (!getUserService().isJwtTokenValid()) {
                    return $q.reject({ config: config });
                }
            }
        }
        if (!rejected) {
            return config;
        }
    }

    function requestError(rejection) {
        if (rejection.config.url.includes('api')) {
            updateLoadingState(rejection.config, false);
        }
        return $q.reject(rejection);
    }

    function response(response) {
        if (response.config.url.includes('api')) {
            updateLoadingState(response.config, false);
        }
        return response;
    }

    function responseError(rejection) {
        $log.log(rejection);
        if (rejection.config.url.includes('api')) {
            updateLoadingState(rejection.config, false);
        }
        var unhandled = false;
        var ignoreErrors = rejection.config.ignoreErrors;
        if (rejection.status === 401) {
            unhandled = true;
        } else if (rejection.status === 403) {
            if (!ignoreErrors) {
                $rootScope.$broadcast('forbidden');
            }
        } else if (rejection.status === 0 || rejection.status === -1) {
            getToast().showError(getTranslate().instant('error.unable-to-connect'));
        } else {
            if (rejection.status === 404) {
                if (!ignoreErrors) {
                    getToast().showError(rejection.config.method + ": " + rejection.config.url + "<br/>" +
                        rejection.status + ": " + rejection.statusText);
                }
            } else {
                unhandled = true;
            }
        }

        if (unhandled) {
            if (rejection.data && rejection.data.error) {
                getToast().showError(rejection.data.error.message);
            } else {
                getToast().showError(getTranslate().instant('error.unhandled-error-code', {errorCode: rejection.status}));
            }
        }
        return $q.reject(rejection);
    }

    function updateLoadingState(config, isLoading) {
        if (!config || angular.isUndefined(config.ignoreLoading) || !config.ignoreLoading) {
            $rootScope.loading = isLoading;
        }
    }
}
