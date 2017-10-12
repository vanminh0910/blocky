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
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import blockyApiUser from '../api/user.service';
import blockyApiLogin from '../api/login.service';
import blockyConfirmOnExit from '../components/confirm-on-exit.directive';

import ProfileRoutes from './profile.routes';
import ProfileController from './profile.controller';
import ChangePasswordController from './change-password.controller';
import ResetPasswordController from './reset-password.controller';

export default angular.module('blocky.profile', [
    uiRouter,
    ngMaterial,
    ngMessages,
    blockyApiUser,
    blockyApiLogin,
    blockyConfirmOnExit
])
    .config(ProfileRoutes)
    .controller('ProfileController', ProfileController)
    .controller('ChangePasswordController', ChangePasswordController)
    .controller('ResetPasswordController', ResetPasswordController)
    .name;
