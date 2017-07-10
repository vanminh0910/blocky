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
/* eslint-disable import/no-unresolved, import/default */

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function DashboardController(dashboardService, userService, $state, $stateParams, $filter, $translate) {

    var dashboardActionsList = [
        {
            onAction: function ($event, item) {
                vm.grid.deleteItem($event, item);
            },
            name: function() { return $translate.instant('action.delete') },
            details: function() { return $translate.instant('dashboard.delete') },
            icon: "delete"
        }
    ];

    var dashboardAddItemActionsList = [
        {
            onAction: function ($event) {
                openDashboardEditor($event);
            },
            name: function() { return $translate.instant('action.create') },
            details: function() { return $translate.instant('dashboard.create-new-dashboard') },
            icon: "insert_drive_file"
        }
    ];

    var vm = this;

    vm.dashboardGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: deleteDashboardTitle,
        deleteItemContentFunc: deleteDashboardText,
        deleteItemsTitleFunc: deleteDashboardsTitle,
        deleteItemsActionTitleFunc: deleteDashboardsActionTitle,
        deleteItemsContentFunc: deleteDashboardsText,

        fetchItemsFunc: fetchDashboards,
        saveItemFunc: saveDashboard,
        clickItemFunc: openDashboardEditor,
        deleteItemFunc: deleteDashboard,

        getItemTitleFunc: getDashboardTitle,
        parentCtl: vm,

        actionsList: dashboardActionsList,
        addItemActions: dashboardAddItemActionsList,

        onGridInited: gridInited,

        addItemText: function() { return $translate.instant('dashboard.add-dashboard-text') },
        noItemsText: function() { return $translate.instant('dashboard.no-dashboards-text') },
        itemDetailsText: function() { return $translate.instant('dashboard.dashboard-details') },
    };

    if (angular.isDefined($stateParams.items) && $stateParams.items !== null) {
        vm.dashboardGridConfig.items = $stateParams.items;
    }

    if (angular.isDefined($stateParams.topIndex) && $stateParams.topIndex > 0) {
        vm.dashboardGridConfig.topIndex = $stateParams.topIndex;
    }

    function deleteDashboardTitle(dashboard) {
        return $translate.instant('dashboard.delete-dashboard-title', {dashboardName: dashboard.name});
    }

    function deleteDashboardText() {
        return $translate.instant('dashboard.delete-dashboard-text');
    }

    function deleteDashboardsTitle(selectedCount) {
        return $translate.instant('dashboard.delete-dashboards-title', {count: selectedCount}, 'messageformat');
    }

    function deleteDashboardsActionTitle(selectedCount) {
        return $translate.instant('dashboard.delete-dashboards-action-title', {count: selectedCount}, 'messageformat');
    }

    function deleteDashboardsText() {
        return $translate.instant('dashboard.delete-dashboards-text');
    }

    function gridInited(grid) {
        vm.grid = grid;
    }

    function fetchDashboards(pageLink) {
        return dashboardService.getAllDashboards(pageLink);
    }

    function saveDashboard(dashboard) {
        return dashboardService.saveDashboard(dashboard);
    }

    function deleteDashboard(dashboardId) {
        return dashboardService.deleteDashboard(dashboardId);
    }

    function getDashboardTitle(dashboard) {
        return dashboard ? dashboard.name : '';
    }

    function openDashboardEditor($event, dashboard) {
        if ($event) {
            $event.stopPropagation();
        }
        if (dashboard) {
            $state.go('home.dashboards.dashboard', {dashboardId: dashboard._id});
        } else {
            $state.go('home.dashboards.new');
        }
        
    }

}
