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
//import $ from 'jquery';

/* eslint-disable angular/angularelement */
import addDashboardTemplate from './add-dashboard.tpl.html';


/*@ngInject*/

export default function DashboardEditorController(dashboardService, $stateParams, $rootScope, toast, $translate, $timeout, $window, $document, $mdDialog, $location, $scope, $log) {

    var dashboardId = $stateParams.dashboardId;
    var vm = this;
    vm.isEdit = true;
    vm.dashboard = {
        name: '',
        template: ''
    };
    vm.currentBoardId;
    vm.modelAsJson;
    vm.defaultTemplate = [
        { type: "button", id: 2, name: "Button", clickMessage: { topic: "", message: "" } },
        { type: "switch", id: 2, name: "Switch", value: 1, onMessage: { topic: "", message: "" }, offMessage: { topic: "", message: "" } },
        { type: "slider", id: 2, name: "Slider", min: 0, max: 100, value: 0, changedMessage: { topic: "" } },
    ];

    if (dashboardId) { // Load existing dashboard
        $rootScope.loading = true;
        dashboardService.getDashboard(dashboardId).then(
            function success(dashboard) {
                vm.dashboard = dashboard;

                $scope.models = {
                    selected: null,
                    templates: vm.defaultTemplate,
                    dropzones: angular.fromJson(vm.dashboard.template)
                };
            },
            function fail() {
                toast.showError($translate.instant('dashboard.dashboard-load-failed-error'));
            }
        );
    } else { // New dashboard
        vm.modelAsJson = {
            "Dashboard": [
                {
                    "type": "button",
                    "id": "1",
                    "name": "Open Living Door",
                    "clickMessage":
                    {
                        "topic": "openDoor",
                        "message": 1
                    }
                }
            ]
        };
        $scope.models = {
            selected: null,
            templates: vm.defaultTemplate,
            dropzones: vm.modelAsJson
        };
    }

    $scope.$watch('models.dropzones', function (model) {
        vm.modelAsJson = angular.toJson(model, true);
    }, true);

    vm.applyChanges = applyChanges;
    vm.cancel = cancel;
    vm.addDashboard = addDashboard;
    vm.widgetAction = widgetAction;

    function applyChanges() {
        vm.dashboard.template = vm.modelAsJson;
        $log.log(vm.dashboard.template);
        if (angular.isUndefined(vm.dashboard._id)) { // New dashboard
            $mdDialog.show({
                controller: () => this,
                controllerAs: 'vm',
                templateUrl: addDashboardTemplate,
                parent: angular.element($document[0].body),
                fullscreen: true
            }).then(function () {
            }, function () {
            });
        } else { // Existing dashboard
            return dashboardService.saveDashboard(vm.dashboard);
        }
    }

    function addDashboard() {
        $mdDialog.hide();
        vm.dashboard.template = vm.modelAsJson;
        dashboardService.addDashboard(vm.dashboard).then(
            function success(dashboard) {
                $location.path('/dashboards/' + dashboard._id);
            },
            function fail() {
                toast.showError($translate.instant('dashboard.dashboard-save-failed-error'));
            }
        );

    }

    function cancel() {
        $mdDialog.cancel();
    }

    function widgetAction(widget) {
        if ((angular.isDefined(widget.clickMessage) && widget.clickMessage.topic !== "")
            || (angular.isDefined(widget.onMessage) && widget.onMessage.topic !== "")
            || (angular.isDefined(widget.offMessage) && widget.offMessage.topic !== "")
            || (angular.isDefined(widget.changedMessage) && widget.changedMessage.topic !== "")) {
            dashboardService.widgetAction(angular.toJson(widget, true)).then(
                function success() {
                },
                function fail() {
                }
            );
        }
    }
}

/* eslint-enable angular/angularelement */