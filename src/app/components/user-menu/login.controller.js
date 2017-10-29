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

import resetPasswordRequestTemplate from './reset-password-request.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function LoginController(toast, loginService, userService, $rootScope, $mdDialog, $window, $document, $scope, $translate) {
    var vm = this;

    vm.user = {
        name: '',
        password: '',
        email: ''
    };

    vm.forgotPassword = forgotPassword;
    vm.login = login;
    vm.cancel = cancel;
    vm.signUp = signUp;
    vm.resetPasswordRequest = resetPasswordRequest;

    function login() {
        loginService.login(vm.user).then(function success(response) {
            var token = response.data.token;
            userService.setUserFromJwtToken(token, true);
            $window.location.reload();
        }, function fail() {});
    }

    function cancel() {
        $mdDialog.cancel();
    }

    function signUp() {
        $rootScope.signUp();
    }

    function resetPasswordRequest($event) {
        $mdDialog.show({
            controller: () => this,
            controllerAs: 'vm',
            templateUrl: resetPasswordRequestTemplate,
            parent: angular.element($document[0].body),
            fullscreen: true,
            targetEvent: $event,
            scope: $scope,
            preserveScope: true
        });
    }

    function forgotPassword() {
        loginService.forgotPassword(vm.user.email).then(function success() {
            toast.showSuccess($translate.instant('login.password-link-sent-message'));
            $mdDialog.cancel();
        }, function fail() {});
    }
}