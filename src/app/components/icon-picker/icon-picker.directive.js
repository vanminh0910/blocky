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

        scope.iconsList = ('air-conditioner bathroom bedroom bluetooth boy-2 brightness-contrast calender camera camera-2 chart chart-2 child-2 cistern clock cloudy-day cloudy-day-1 cold-temperature color computer contact door-close door-open dryer energy eye eye-blocked eye-minus eye-plus family fire-1 folder garage-down garage-up grass greenhouse hanger hanger-1 heater-1 home hot-thermometer hotel-keycard iconmonstr-error-8 iconmonstr-lock-10 iconmonstr-lock-12 iconmonstr-shield-14 iconmonstr-video-2 information key kitchen light-bulb-off monitor moon nature roller-shutter-door roller-shutter-door-crossed rss settings siren smiling-emoticon-square-face snoflakes-winter-cloud sofa solarpanel stop stormy-cloud-with-rain-and-thunder sun tree umbrella volume-decrease volume-increase volume-medium volume-mute2 washing iconmonstr-shield-12 printer alarm carkey curtain faucetcool fan faucethot fence heater doorknob homemusic homepass garageclose garageopen telephone solarpanel-1 wifi windowsclose unlock windowsopen chevron-down chevron-left chevron-right chevron-up ambulance heartbeat microphone-slash microphone zynga play-button battery excellent-wifi-signal good-wifi-signal fair-wifi-signal poor-wifi-signal map-marker list-ol')
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