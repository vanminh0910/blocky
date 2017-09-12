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
export default angular.module('blocky.filters.displayFormat', [])
    .filter('displayFormat', DisplayFormat)
    .name;

/*@ngInject*/
function DisplayFormat() {
    return function (value, format, gaugeOption) {
        var displayFormat = '';
        var prefixFormat = '';
        var subfixFormat = '';
        if (format && !isNaN(parseFloat(value)) && isFinite(value)) {
            value = parseFloat(value);
            if (format.indexOf('.') < 0) {
                value = value.toFixed(0);
                prefixFormat = format.split('#')[0];
                subfixFormat = format.split('#')[1];
                displayFormat = format.replace('#', value);
            } else {
                prefixFormat = format.split('.')[0];
                subfixFormat = format.split('.')[1];
                var decimals = (subfixFormat.match(/#/g) || []).length;
                value = value.toFixed(decimals);
                prefixFormat = prefixFormat.replace(/#/g, '');
                subfixFormat = subfixFormat.replace(/#/g, '');
                displayFormat = prefixFormat + value + subfixFormat;
            }
            displayFormat = displayFormat.replace(/#/g, '');
            if (gaugeOption === 0) {
                return value;
            } else if (gaugeOption === -1) {
                return prefixFormat;
            } else if (gaugeOption === 1) {
                return subfixFormat;
            }
            return displayFormat;
        } else {
            if (gaugeOption === -1) {
                return '';
            } else if (gaugeOption === 1) {
                return '';
            } else {
                return value;
            }
        }
    };
}