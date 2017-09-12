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

import codelabTemplate from './codelab.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function CodeLabRoutes($stateProvider) {

    $stateProvider
        .state('home.codelab', {
            url: '/codelab',
            module: 'public',
            views: {
                "content@home": {
                    templateUrl: codelabTemplate,
                    controllerAs: 'vm',
                    controller: 'CodeLabController'
                }
            },
            data: {
                pageTitle: 'home.codelab'
            }
        })
        .state('home.codelab.new', {
            url: '/new',
            views: {
                "content@home": {
                    templateUrl: codelabTemplate,
                    controllerAs: 'vm',
                    controller: 'CodeLabController'
                }
            }
        })
        .state('home.codelab.view', {
            url: '/:scriptId',
            views: {
                "content@home": {
                    templateUrl: codelabTemplate,
                    controllerAs: 'vm',
                    controller: 'CodeLabController'
                }
            }
        });
}
