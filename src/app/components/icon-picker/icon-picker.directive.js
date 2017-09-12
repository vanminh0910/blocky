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
import './icon-picker.scss';
/* eslint-disable import/no-unresolved, import/default */
import iconPickerTemplate from './icon-picker.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

export default angular.module('blocky.directives.iconPicker', [])
    .directive('tbIconPicker', IconPicker)
    .name;

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
function IconPicker($compile, $templateCache, $mdSelect) {

    var linker = function (scope, element) {
        var template = $templateCache.get(iconPickerTemplate);
        element.html(template);

        scope.iconsList = ('fa-lightbulb-o fa-snowflake-o fa-bath fa-free-code-camp fa-thermometer-empty fa-thermometer-quarter fa-thermometer-half fa-thermometer-three-quarters fa-thermometer-full fa-telegram fa-arrows fa-arrows-h fa-arrows-v fa-asterisk fa-car fa-ban fa-battery-empty fa-battery-quarter fa-battery-three-quarters fa-battery-half fa-battery-full fa-bell fa-bell-o fa-bell-slash fa-bell-slash-o fa-bluetooth fa-bluetooth-b fa-bolt fa-bullhorn fa-calendar fa-calendar-check-o fa-calendar-minus-o fa-calendar-o fa-calendar-plus-o fa-calendar-times-o fa-camera fa-camera-retro fa-check fa-check-circle fa-check-circle-o fa-check-square fa-check-square-o fa-circle fa-circle-o fa-circle-o-notch fa-circle-thin fa-clock-o fa-times fa-cloud fa-cloud-download fa-cloud-upload fa-envelope fa-envelope-o fa-envelope-open fa-envelope-open-o fa-envelope-square fa-exclamation fa-exclamation-circle fa-exclamation-triangle fa-eye fa-eye-slash fa-microphone fa-microphone-slash fa-percent fa-plug fa-power-off fa-question fa-question-circle fa-question-circle-o fa-signal fa-square-o fa-toggle-off fa-toggle-on fa-lock fa-unlock fa-unlock-alt fa-wifi fa-play-circle fa-pause fa-expand fa-compress fa-heart fa-heart-o')
            .split(' ').map(function (icon) {
                return {
                    icon: icon
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
            icon: '=',
        }
    };
}