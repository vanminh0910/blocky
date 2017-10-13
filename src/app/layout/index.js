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
import './home.scss';

import uiRouter from 'angular-ui-router';
import FBAngular from 'angular-fullscreen';

import HomeRoutes from './home.routes';
import HomeController from './home.controller';

import blockyCodeLab from '../codelab';
import blockyDashboard from '../dashboard';
import blockyUserMenu from '../components/user-menu/user-menu.directive';
import blockyMenu from '../services/menu.service';
import blockProfile from '../profile';
import blockSetting from '../setting';

export default angular.module('blocky.home', [
    uiRouter,
    FBAngular.name,
    blockyCodeLab,
    blockyUserMenu,
    blockyMenu,
    blockyDashboard,
    blockProfile,
    blockSetting
])
    .config(HomeRoutes)
    .controller('HomeController', HomeController)
    .name;
