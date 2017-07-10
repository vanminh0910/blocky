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
import uiRouter from 'angular-ui-router';
import blockyGrid from '../components/grid.directive';
import blockyApiUser from '../api/user.service';
import blockyToast from '../services/toast';

import UserRoutes from './user.routes';
import UserController from './user.controller';
import UserDirective from './user.directive';

export default angular.module('blocky.user', [
    uiRouter,
    blockyGrid,
    blockyApiUser,
    blockyToast
])
    .config(UserRoutes)
    .controller('UserController', UserController)
    .directive('tbUser', UserDirective)
    .name;
