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
import './dashboard.scss';
import uiRouter from 'angular-ui-router';

import DashboardRoutes from './dashboard.routes';
import DashboardController from './dashboard.controller';
import blockyApiDashboard from '../api/dashboard.service';
import blockyIconPicker from '../components/icon-picker/icon-picker.directive';
import blockyColorPicker from '../components/color-picker/color-picker.directive';
import blockySwitchWidget from '../components/switch-widget/switch-widget.directive';
import blockyDisplayFormat from '../components/display-format.filter';
import menuService from '../components/bottom-sheet-grid/bottom-sheet-grid.service';
export default angular.module('blocky.dashboard', [
    uiRouter,
    blockyApiDashboard,
    blockyIconPicker,
    blockyColorPicker,
    blockySwitchWidget,
    blockyDisplayFormat,
    menuService,
])
    .config(DashboardRoutes)
    .controller('DashboardController', DashboardController)
    .name;
