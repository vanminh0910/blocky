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
import './codelab.scss';
import 'angular-ui-ace';

import uiRouter from 'angular-ui-router';

import CodeLabRoutes from './codelab.routes';
import CodeLabController from './codelab.controller';
import blockyApiScript from '../api/script.service';
import blockyApiDevice from '../api/device.service';

export default angular.module('blocky.codelab', [
    uiRouter,
    blockyApiScript,
    blockyApiDevice,
    'ui.ace'
])
    .config(CodeLabRoutes)
    .controller('CodeLabController', CodeLabController)
    .name;
