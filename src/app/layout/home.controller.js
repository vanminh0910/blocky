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


/* eslint-disable import/no-unresolved, import/default */

/* eslint-enable import/no-unresolved, import/default */

/* eslint-disable angular/angularelement */

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
export default function HomeController(menu, $state, Fullscreen, deviceService, userService, settings, store, $scope, $log) {
    var vm = this;
    var mqttClient;
    var authKey = '';
    var baseSysTopicUrl = '';
    vm.isUserLoaded = userService.isAuthenticated();

    $scope.$on('$stateChangeSuccess', function () {
        if ($state.current.name === 'home' || $state.current.name.indexOf('codelab') > -1) {
            vm.currentNavItem = 'home.codelab';
        } else {
            vm.currentNavItem = $state.current.name;
        }
    });

    vm.navItems = menu.getNavItems();
    vm.Fullscreen = Fullscreen;

    if (vm.isUserLoaded) {
        authKey = userService.getCurrentUser().authKey;
        baseSysTopicUrl = authKey + '/sys/';
    }

    try {
        if (angular.isDefined(mqtt) && vm.isUserLoaded) {
            mqttClient = mqtt.connect(settings.mqtt.url, {
                host: settings.mqtt.host,
                port: settings.mqtt.port,
                username: '',
                password: authKey
            });

            mqttClient.on('connect', function () {
                initDevicesLogs();
            });
            mqttClient.on('message', function (topic, message) {
                topic = topic.replace(baseSysTopicUrl, '');
                message = message.toString();
                updateDevicesLogs(topic, message);
            });
        }
    } catch (err) {
        $log.log('Exception:', err.message);
    }

    function initDevicesLogs() {
        deviceService.getAllDevices().then(function success(devices) {
            if (devices.length) {
                var chipId = '';
                if (mqttClient && mqttClient.connected) {
                    for (var i = 0; i < devices.length; i++) {
                        chipId = devices[i].chipId;
                        var logTopic = baseSysTopicUrl + chipId + '/log';
                        mqttClient.unsubscribe(logTopic);
                        mqttClient.subscribe(logTopic, {
                            qos: 2
                        });
                        $log.log('subscribe device log', chipId, '/log');
                    }
                }
            }
        });
    }

    function updateDevicesLogs(topic, message) {
        var chipId = '';
        if (topic.indexOf('/log') > -1 && message.length) {
            chipId = topic.replace('/log', '');
            var deviceLog = store.get('deviceLog_' + chipId) || '';
            if (deviceLog.length) {
                message = message + '<br>' + deviceLog;
            }
            store.set('deviceLog_' + chipId, message);
        }
    }
}

/* eslint-enable angular/angularelement */