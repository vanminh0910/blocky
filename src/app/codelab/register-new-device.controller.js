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
export default function RegisterNewDeviceController($scope, $mdDialog, $log, $q, $timeout, deviceService) {
    var vm = this;
    vm.submitCurrentStep = submitCurrentStep;
    vm.enableNextStep = enableNextStep;
    vm.moveToPreviousStep = moveToPreviousStep;
    vm.closeDialog = closeDialog;
    vm.loadAPList = loadAPList;

    function closeDialog() {
        $mdDialog.hide();
    }

    vm.selectedStep = 0;
    vm.stepProgress = 1;
    vm.maxStep = 3;
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
    ];

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
        if (vm.selectedStep > 0) {
            vm.selectedStep = vm.selectedStep - 1;
        }
    }

    function submitCurrentStep(stepData, isSkip) {
        var deferred = $q.defer();
        vm.showBusyText = true;
        $log.log('On before submit');
        if (!stepData.completed && !isSkip) {
            //simulate $http
            $timeout(function () {
                vm.showBusyText = false;
                $log.log('On submit success');
                deferred.resolve({
                    status: 200,
                    statusText: 'success',
                    data: {}
                });
                //move to next step when success
                stepData.completed = true;
                vm.enableNextStep();
            }, 1000)
        } else {
            vm.showBusyText = false;
            vm.enableNextStep();
        }
    }

    function loadAPList() {
        $log.log('loadUserDevices');
        deviceService.loadAPList().then(function success(APList) {
            if (APList.length) {
                vm.APList = APList;
                $log.log(vm.APList);
            }
        });
    }
}