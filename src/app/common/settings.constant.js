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
export default angular.module('blocky.settings', [])
    .constant('settings',
        {
            baseApiUrl: 'https://api.getblocky.com/staging', //'https://api.getblocky.com/prod',
            localApiUrl: 'http://192.168.4.1',
            entryPoints: {
                login: '/users/signup',
                signup: '/users/login',
                forgotPassword: '/users/forgotPassword',
                resetPassword: '/users/resetPassword'
            },
            mqtt: {
                url: 'wss://staging.broker.getblocky.com', //'wss://broker.getblocky.com',
                host: 'staging.broker.getblocky.com', //'broker.getblocky.com',
                port: '8883'
            },
            maxBytesUpload: 900
        }
    ).name;
