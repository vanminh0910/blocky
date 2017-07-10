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

import scriptTemplate from './script.tpl.html';
import scriptEditorTemplate from './script-editor.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function ScriptRoutes($stateProvider) {

    $stateProvider
        .state('home.scripts', {
            url: '/scripts',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: scriptTemplate,
                    controllerAs: 'vm',
                    controller: 'ScriptController'
                }
            },
            data: {
                searchEnabled: true,
                pageTitle: 'script.scripts'
            },
            ncyBreadcrumb: {
                label: '{"icon": "code", "label": "script.scripts"}'
            }
        })
        .state('home.scripts.new', {
            url: '/new',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: scriptEditorTemplate,
                    controller: 'ScriptEditorController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'script.new'
            },
            ncyBreadcrumb: {
                label: '{"icon": "code", "label": "script.new"}'
            }
        })
        .state('home.scripts.script', {
            url: '/:scriptId',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: scriptEditorTemplate,
                    controller: 'ScriptEditorController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'script.script'
            },
            ncyBreadcrumb: {
                label: '{"icon": "code", "label": "{{ vm.script.name }}", "translate": "false"}'
            }
        });
}
