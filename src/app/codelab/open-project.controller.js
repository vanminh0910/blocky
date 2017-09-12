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
export default function OpenProjectController($scope, scriptService, $mdDialog, $log, $state) {
    var vm = this;

    vm.removeFilter = removeFilter;
    vm.addItem = addItem;
    vm.openProject = openProject;
    vm.cancel = cancel;

    $scope.promise = scriptService.getAllScripts().then(function success(projects) {
        vm.projects = projects;
    }).$promise;

    vm.selected = [];

    vm.query = {
        order: '-updatedAt',
        limit: 5,
        page: 1
    };

    vm.filters = [];
    $scope.$watch('filter.search', function (newValue) {
        if (angular.isDefined(newValue)) {
            vm.filters = newValue.split(" ");
        }
    });

    vm.searchData = {};

    vm.customSearch = function (item) {
        vm.searchData.status = true;

        angular.forEach(vm.filters, function (value1) {
            vm.searchData.tempStatus = false;
            angular.forEach(item, function (value2) {
                var dataType = typeof (value2);
                if (dataType == "string" && (!value2.includes('object'))) {
                    if (value2.toLowerCase().includes(value1)) {
                        vm.searchData.tempStatus = true;
                    }
                } else if (dataType == "number") {
                    var num = value2.toString();
                    if (num.includes(value1)) {
                        vm.searchData.tempStatus = true;
                    }
                }
            });
            vm.searchData.status = vm.searchData.status & vm.searchData.tempStatus;
        });

        return vm.searchData.status;
    };

    function removeFilter() {
        $scope.filter.show = false;
    }

    function addItem() {
        $state.go('home.codelab.new');
        $mdDialog.hide();
    }

    function openProject(id) {
        $state.go('home.codelab.view', {scriptId: id});
        $mdDialog.hide();
    }

    function cancel() {
        $mdDialog.cancel();
    }
}