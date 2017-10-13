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
export default function resetPassWordController($translate, toast, loginService, userService, $mdDialog, $rootScope) {
    var vm = this;

    vm.user = {
        email: ''
    };
    vm.login = login;
    vm.resetPassWord = resetPassWord;
    vm.cancel = cancel;

    function resetPassWord() {
        toast.showSuccess('Password had been reset. Please check your mail!', 3000, 'theForm');
        $mdDialog.cancel();
    }

    function login() {
        $rootScope.login();
    }

    function cancel() {
        $mdDialog.cancel();
    }
}