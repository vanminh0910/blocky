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
import UrlHandler from './url.handler';

/*@ngInject*/
export default function AppRun($rootScope, $injector, $location, $state, $mdDialog, userService, $translate, store) {

    var forbiddenDialog = null;

    initWatchers();

    function initWatchers() {
        $rootScope.unauthenticatedHandle = $rootScope.$on('unauthenticated', function (event, doLogout) {
            if (doLogout) {
                $state.go('home.codelab');
            } else {
                UrlHandler($injector, $location);
            }
        });

        $rootScope.authenticatedHandle = $rootScope.$on('authenticated', function () {
            UrlHandler($injector, $location);
        });

        $rootScope.forbiddenHandle = $rootScope.$on('forbidden', function () {
            showForbiddenDialog();
        });

        $rootScope.pageTitle = 'Blocky';

        $rootScope.stateChangeSuccessHandle = $rootScope.$on('$stateChangeSuccess', function (evt, to) {
            var lastState = store.get('lastState');
            if (to.name === 'home' && lastState) {
                $state.go(lastState);
            } else if (to.name === 'home') {
                $state.go('home.codelab');
            }

            store.set('lastState', to.name);
            if (angular.isDefined(to.data.pageTitle)) {
                $translate(to.data.pageTitle).then(function (translation) {
                    $rootScope.pageTitle = 'Blocky | ' + translation;
                }, function (translationId) {
                    $rootScope.pageTitle = 'Blocky | ' + translationId;
                });
            }
        });
    }

    function showForbiddenDialog() {
        if (forbiddenDialog === null) {
            $translate(['access.access-forbidden',
                'access.access-forbidden-text',
                'access.access-forbidden',
                'action.cancel',
                'action.sign-in'
            ]).then(function (translations) {
                if (forbiddenDialog === null) {
                    forbiddenDialog = $mdDialog.confirm()
                        .title(translations['access.access-forbidden'])
                        .htmlContent(translations['access.access-forbidden-text'])
                        .ariaLabel(translations['access.access-forbidden'])
                        .cancel(translations['action.cancel'])
                        .ok(translations['action.sign-in']);
                    $mdDialog.show(forbiddenDialog).then(function () {
                        forbiddenDialog = null;
                        userService.logout();
                    }, function () {
                        forbiddenDialog = null;
                    });
                }
            });
        }
    }
}