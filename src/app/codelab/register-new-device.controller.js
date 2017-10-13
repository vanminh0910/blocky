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

/* eslint-disable import/no-unresolved, import/default */

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function RegisterNewDeviceController($scope, $mdDialog, $log, $q, $timeout, deviceService, $rootScope, settings, $window, $interval) {
    var vm = this;
    var promise;

    vm.connectNotification = true;
    vm.selectedStep = 0;
    vm.stepProgress = 1;
    vm.maxStep = 4;
    vm.showBusyText = false;
    vm.stepData = [{
            step: 1,
            completed: false,
            optional: false,
            data: {}
        },
        {
            step: 2,
            completed: false,
            optional: false,
            data: {}
        },
        {
            step: 3,
            completed: false,
            optional: false,
            data: {}
        }
    ];

    vm.enableNextStep = enableNextStep;
    vm.moveToPreviousStep = moveToPreviousStep;
    vm.closeDialog = closeDialog;
    vm.loadAccessPointList = loadAccessPointList;
    vm.saveSetting = saveSetting;
    vm.showConfirmReload = showConfirmReload;
    vm.reloadPage = reloadPage;
    vm.showConfirmCancel = showConfirmCancel;

    function closeDialog() {
        $mdDialog.hide();
        $interval.cancel(promise);
    }

    function enableNextStep() {
        //do not exceed into max step
        if (vm.selectedStep >= vm.maxStep) {
            return;
        }
        //do not increment vm.stepProgress when submitting from previously completed step
        if (vm.selectedStep === vm.stepProgress - 1) {
            vm.stepProgress = vm.stepProgress + 1;
        }
        vm.selectedStep = vm.selectedStep + 1;
    }

    function moveToPreviousStep() {
        $interval.cancel(promise);
        if (vm.selectedStep > 0) {
            vm.selectedStep = vm.selectedStep - 1;
        }
    }

    function loadAccessPointList() {
        $log.log('loadUserDevices');
        vm.APList;
        vm.counter = 1;

        promise = $interval(function () {
            deviceService.loadAccessPointList().then(function success(APList) {
                vm.APList = APList;
                $interval.cancel(promise);
                vm.enableNextStep();
                $log.log(vm.APList);
            }, function fail(APList) {
                vm.APList = APList;
                if (vm.counter < 3) {
                    vm.counter++;
                } else {
                    $interval.cancel(promise);
                    vm.connectNotification = false;
                    $log.log(vm.counter);
                }
            });
        }, 2000);
    }

    function saveSetting(ssid, pass, name) {
        vm.ssid = ssid;
        vm.passWifi = pass;
        vm.deviceName = name;
        vm.authKey = $rootScope.authKey;
        vm.urlCommitInfo = settings.localApiUrl + '/set?ssid=' + vm.ssid + '&password=' + vm.passWifi + '&authKey=' + vm.authKey;
        $log.log(vm.urlCommitInfo);
        deviceService.saveDeviceConfig(vm.urlCommitInfo);
    }

    function showConfirmReload(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('You setup success')
            .textContent('You have to wait 10 seconds, re-connect to your home wifi, after that click "Reload" button below.')
            .ariaLabel('setup success')
            .targetEvent(ev)
            .ok('Reload')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function () {
            vm.reloadPage();
        }, function () {
            // do somethings when click cancel
        });
    }

    function showConfirmCancel(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('You setup unsuccess')
            .textContent('You have to wait 10 seconds, re-connect to your home wifi, after that click "Reload" button below.')
            .ariaLabel('setup unsuccess')
            .targetEvent(ev)
            .ok('Reload')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function () {
            vm.reloadPage();
        }, function () {
            // do somethings when click cancel
        });
    }


    function reloadPage() {
        $window.location.reload();
    }
}