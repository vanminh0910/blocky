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

import dashboardTemplate from './dashboard.tpl.html';
import dashboardEditorTemplate from './dashboard-editor.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function DashboardRoutes($stateProvider) {

    $stateProvider
        .state('home.dashboards', {
            url: '/dashboards',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: dashboardTemplate,
                    controllerAs: 'vm',
                    controller: 'DashboardController'
                }
            },
            data: {
                searchEnabled: true,
                pageTitle: 'dashboard.dashboards'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "dashboard.dashboards"}'
            }
        })
        .state('home.dashboards.new', {
            url: '/new',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: dashboardEditorTemplate,
                    controller: 'DashboardEditorController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'dashboard.new'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "dashboard.new"}'
            }
        })
        .state('home.dashboards.dashboard', {
            url: '/:dashboardId',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: dashboardEditorTemplate,
                    controller: 'DashboardEditorController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'dashboard.dashboard'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "{{ vm.dashboard.name }}", "translate": "false"}'
            }
        });
}
