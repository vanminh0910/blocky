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
import './color-picker.scss';
/* eslint-disable import/no-unresolved, import/default */
import colorPickerTemplate from './color-picker.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

export default angular.module('blocky.directives.colorPicker', [])
    .directive('tbColorPicker', ColorPicker)
    .name;

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
function ColorPicker($compile, $templateCache, $mdSelect) {

    var linker = function (scope, element) {
        var template = $templateCache.get(colorPickerTemplate);
        element.html(template);

        scope.colorsList = ('#f44336 #e91e63 #9c27b0 #673ab7 #3f51b5 #2196f3 #03a9f4 #00bcd4 #009688 #4caf50 #8bc34a #cddc39 #ffeb3b #ffc107 #ff9800 #ff5722 #795548 #9e9e9e #607d8b #000000')
            .split(' ').map(function (color) {
                return {
                    color: color
                };
            });

        scope.closeDropdown = function () {
            $mdSelect.hide();
        };

        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            color: '=',
        }
    };
}