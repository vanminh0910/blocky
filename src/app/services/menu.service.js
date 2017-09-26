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

export default angular.module('blocky.menu', [])
    .factory('menu', Menu)
    .name;

/*@ngInject*/
function Menu() {

    var service = {
        getNavItems: getNavItems
    }

    return service;

    function getNavItems() {
        var navItems = [
            {
                name: 'home.codelab',
                attributeName: 'home.codelab',
                state: 'home.codelab',
                faIcon: 'fa-file-code-o'
            },
            {
                name: 'home.dashboard',
                attributeName: 'home.dashboard',
                state: 'home.dashboard',
                faIcon: 'fa-th'
            }
        ];

        return navItems;
    }

}