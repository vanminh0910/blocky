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
export default function RegisterNewDeviceController($scope, $mdDialog, $log, $q, $timeout, deviceService, $rootScope, $interval, settings) {
    var vm = this;
    var promise

    vm.enableNextStep = enableNextStep;
    vm.moveToPreviousStep = moveToPreviousStep;
    vm.closeDialog = closeDialog;
    vm.loadAPList = loadAPList;
    vm.getSSID = getSSID;
    vm.saveSetting = saveSetting;
    vm.pingToBlocky = pingToBlocky;
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
        },
        {
            step: 4,
            completed: false,
            optional: false,
            data: {}
        },
    ];

    function closeDialog() {
        $interval.cancel(promise);
        $mdDialog.hide();
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

    function loadAPList() {
        $log.log('loadUserDevices');
        deviceService.loadAPList().then(function success(APList) {
            if (APList.length) {
                vm.APList = APList;
                $interval.cancel(promise);
                $log.log(vm.APList);
            }
        }, function fail(APList) {
            $log.log(APList);
            vm.pingToBlocky();
        });
    }

    function pingToBlocky() {
        promise = $interval(vm.loadAPList, 2000);
    }

    function getSSID(params) {
        $interval.cancel(promise);
        vm.ssid = params;
        $log.log(vm.ssid);
    }

    function saveSetting(pass, name) {
        vm.passWifi = pass;
        vm.blockyName = name;
        vm.authKey = $rootScope.authKey;
        vm.urlCommitInfo = settings.localApiUrl + '/set?ssid=' + vm.ssid + '&password=' + vm.passWifi + '&authKey=' + vm.authKey;
        $log.log(vm.urlCommitInfo);
        deviceService.postToBlocky(vm.urlCommitInfo);
    }
}