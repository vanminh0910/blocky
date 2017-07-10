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
import './home.scss';

import uiRouter from 'angular-ui-router';
import ngSanitize from 'angular-sanitize';
import FBAngular from 'angular-fullscreen';
import 'angular-breadcrumb';

import blockyMenu from '../services/menu.service';
import blockyApiLogin from '../api/login.service';
import blockyApiUser from '../api/user.service';

import blockyNoAnimate from '../components/no-animate.directive';
import blockySideMenu from '../components/side-menu.directive';

import blockyUserMenu from './user-menu.directive';

import blockyUser from '../user';
import blockyHomeLinks from '../home';
import blockyProfile from '../profile';
import blockyBoard from '../board';
import blockyScript from '../script';
import blockyDashboard from '../dashboard';

import HomeRoutes from './home.routes';
import HomeController from './home.controller';
import BreadcrumbLabel from './breadcrumb-label.filter';
import BreadcrumbIcon from './breadcrumb-icon.filter';

export default angular.module('blocky.home', [
    uiRouter,
    ngSanitize,
    FBAngular.name,
    'ncy-angular-breadcrumb',
    blockyMenu,
    blockyHomeLinks,
    blockyUserMenu,
    blockyUser,
    blockyProfile,
    blockyBoard,
    blockyScript,
    blockyDashboard,
    blockyApiLogin,
    blockyApiUser,
    blockyNoAnimate,
    blockySideMenu
])
    .config(HomeRoutes)
    .controller('HomeController', HomeController)
    .filter('breadcrumbLabel', BreadcrumbLabel)
    .filter('breadcrumbIcon', BreadcrumbIcon)
    .name;
