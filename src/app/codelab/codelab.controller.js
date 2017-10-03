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

import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-lua';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/snippets/lua';
import 'ace-builds/src-min-noconflict/theme-github';
import 'angular-material-data-table/dist/md-data-table.min.css';

/* eslint-disable angular/angularelement */
import OpenProjectController from './open-project.controller';
import openProjectTemplate from './open-project.tpl.html';
import saveProjectMobileTemplate from './save-project-mobile.tpl.html';
import bottomSheetActionsTemplate from './bottom-sheet-actions.tpl.html';
import bottomSheetDeviceLogTemplate from './bottom-sheet-device-log.tpl.html';
import blocklyToolbox from './blockly-toolbox.tpl.html';
import renameDeviceTemplate from './rename-device.tpl.html';
import registerDeviceTemplate from './register-new-device.tpl.html';
import RegisterNewDeviceController from './register-new-device.controller.js';

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
export default function CodeLabController($mdSidenav, toast, scriptService, userService, deviceService, $translate, $mdDialog, $document, $rootScope, $scope, $stateParams, $state, store, $location, $mdBottomSheet, settings, $timeout, $log) {
    var vm = this;
    var mqttClient;
    var authKey = '';
    var baseTopicUrl = '';

    vm.isUserLoaded = userService.isAuthenticated();
    if (vm.isUserLoaded) {
        authKey = userService.getCurrentUser().authKey;
        $rootScope.authKey = authKey;
        baseTopicUrl = '/' + authKey + '/';
    } else {
        vm.devices = [{
            id: 0,
            name: 'Demo device',
            status: 0
        }];
    } 

    initMqttSession();

    var emptyScript = {
        name: '',
        xml: '',
        lua: '',
        mode: 'block'
    };
    vm.script = {
        name: '',
        xml: '',
        lua: '',
        mode: 'block'
    };
    vm.isSidenavOpen = true;
    vm.blocklyToolbox = blocklyToolbox;
    vm.xmlText = '';

    var scriptId = $stateParams.scriptId;
    var localScript = store.get('script');

    initScriptData();

    vm.luaEditorOptions = {
        useWrapMode: true,
        showGutter: true,
        theme: 'github',
        mode: 'lua',
        require: ['ace/ext/language_tools'],
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        }
    };
    vm.currentDevice = null;
    vm.currentLog = '';
    vm.isUploadSuccess = false;

    if ($state.current.name === 'home.codelab.new') {
        store.remove('script');
        vm.script = {
            name: '',
            xml: '',
            lua: '',
            mode: 'block'
        };
        vm.xmlText = vm.script.xml;
        store.set('script', vm.script);
    }

    $scope.$watch(() => this.script.lua, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            var script = store.get('script');
            script.mode = 'lua';
            script.lua = newValue;
            store.set('script', script);
        }
    });
    $scope.$watch(() => this.script.name, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            var script = store.get('script');
            script.name = newValue;
            store.set('script', script);
        }
    });

    $scope.$watch(() => this.currentDevice, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            vm.currentLog = store.get('deviceLog_' + vm.currentDevice.chipId) || '';
            if (vm.currentDevice.id) {
                store.set('selectedDeviceId', vm.currentDevice.id);
            }
        }
    });

    $scope.$watch(() => this.xmlText, function (newValue, oldValue) {
        if (vm.workspace && newValue && !angular.equals(newValue, oldValue)) {
            $log.log('load xml');
            if (Blockly.mainWorkspace !== null) {
                Blockly.mainWorkspace.clear();
            }
            var xml = Blockly.Xml.textToDom(newValue);
            Blockly.Xml.domToWorkspace(xml, vm.workspace);
        }
    });

    window.addEventListener('resize', onResize, false);
    $scope.$on("$destroy", function () {
        if (mqttClient) {
            mqttClient.end();
        }
        window.removeEventListener('resize', onResize, false);
    });

    $timeout(function () {
        injectBlockly();
    }, 1000);

    vm.changeMode = changeMode;
    vm.saveProject = saveProject;
    vm.saveProjectMobile = saveProjectMobile;
    vm.newProject = newProject;
    vm.openProject = openProject;
    vm.downloadProject = downloadProject;
    vm.toggleSidenav = toggleSidenav;
    vm.uploadScript = uploadScript;
    vm.cancel = cancel;
    vm.showBottomSheetActions = showBottomSheetActions;
    vm.renameProject = renameProject;
    vm.deleteProject = deleteProject;
    vm.showDeviceLog = showDeviceLog;
    vm.renameDevice = renameDevice;
    vm.saveDevice = saveDevice;
    vm.deleteDevice = deleteDevice;
    vm.addDevice = addDevice;
    vm.clearDeviceLog = clearDeviceLog;

    function initMqttSession() {
        if (mqtt && vm.isUserLoaded) {
            mqttClient = mqtt.connect(settings.mqtt.url, {
                host: settings.mqtt.host,
                port: settings.mqtt.port,
                username: '',
                password: authKey
            });
            mqttClient.on('connect', function () {
                $timeout(function () {
                    loadUserDevices();
                });
            });
            mqttClient.on('message', function (topic, message) {
                $timeout(function () {
                    message = message.toString();
                    $log.log('Code Lab Recieved Message:', topic, message);
                    var chipId = '';
                    if (topic.indexOf('/log') > -1 && message.length) {
                        chipId = topic.replace(baseTopicUrl, '').replace('/log', '');
                        var deviceLog = store.get('deviceLog_' + chipId) || '';
                        if (vm.currentDevice && vm.currentDevice.chipId === chipId) {
                            vm.currentLog = deviceLog;
                        }
                    } else if (topic.indexOf('/register') > -1) {
                        chipId = angular.fromJson(message).chipId;
                        updateDeviceStatusByChipId(chipId, 1);
                    } else if (topic.indexOf('/offline') > -1) {
                        chipId = topic.replace(baseTopicUrl, '').replace('/offline', '');
                        updateDeviceStatusByChipId(chipId, 0);
                    } else if (topic.indexOf('/ota_ack') > -1) {
                        vm.isUploadSuccess = true;
                        toast.showSuccess($translate.instant('script.script-upload-success'));
                    }
                }, 500);
            });
        }
    }

    function initScriptData() {
        if (scriptId) { // Load existing script
            scriptService.getScript(scriptId).then(
                function success(script) {
                    vm.script.id = script.id;
                    vm.script.name = script.name;
                    vm.script.xml = script.xml || '';
                    vm.script.lua = script.lua || '';
                    vm.script.mode = script.mode || 'block';
                    if (vm.script.mode === 'block') {
                        vm.xmlText = vm.script.xml;
                    }
                    $log.log('Load existing script');
                    store.set('script', vm.script);
                },
                function fail() {
                    toast.showError($translate.instant('script.script-load-failed-error'));
                }
            );
        } else if (localScript) {
            vm.script = localScript;
        } else {
            store.set('script', emptyScript);
        }
    }

    function updateDeviceStatusByChipId(chipId, status) {
        vm.currentDevice = undefined;
        for (var i = 0; i < vm.devices.length; i++) {
            if (chipId.toString() === vm.devices[i].chipId.toString()) {
                $log.log('updateDeviceStatusByChipId', chipId, status);
                vm.devices[i].status = status;
                if (status) {
                    toast.showSuccess('Device ' + vm.devices[i].name + ' has come online');
                } else {
                    toast.showError('Device ' + vm.devices[i].name + ' just went offline');
                }
                $timeout(function () {
                    loadSelectedDevice();
                }, 1000);
                return;
            }
        }
        loadUserDevices();
    }

    function injectBlockly() {
        if (!vm.workspace) {
            $log.log('injectBlockly');
            var blocklyDiv = document.getElementById('blocklyDiv');
            vm.workspace = Blockly.inject(blocklyDiv, {
                grid: {
                    spacing: 25,
                    length: 3,
                    colour: '#ccc',
                    snap: true
                },
                toolbox: document.getElementById('toolbox'),
                sounds: false,
                zoom: {
                    controls: true,
                    wheel: false
                },
                trashcan: true
            });

            onResize();
            localScript = store.get('script');
            if (!scriptId && angular.isDefined(localScript.xml)) {
                $log.log('load local');
                if (angular.isDefined(Blockly.mainWorkspace)) {
                    Blockly.mainWorkspace.clear();
                }
                if (localScript.xml) {
                    var xml = Blockly.Xml.textToDom(localScript.xml);
                    Blockly.Xml.domToWorkspace(xml, vm.workspace);
                }
            }
            vm.workspace.addChangeListener(onWorkspaceChange);
        }
    }

    function onResize() {
        if (vm.script.mode !== 'block') {
            return;
        }
        $log.log('on resize');
        var blocklyArea = document.getElementById('main-content');
        var blocklyDiv = document.getElementById('blocklyDiv');
        // Compute the absolute coordinates and dimensions of blocklyArea.
        var el = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            el = el.offsetParent;
        } while (el);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        if (vm.workspace) {
            if (angular.isDefined(Blockly.mainWorkspace)) {
                Blockly.mainWorkspace.clear();
            }
            localScript = store.get('script');
            if (localScript.xml) {
                var xml = Blockly.Xml.textToDom(localScript.xml);
                Blockly.Xml.domToWorkspace(xml, vm.workspace);
            }

            Blockly.svgResize(vm.workspace);
        }
    }

    function onWorkspaceChange() {
        if (vm.script.mode !== 'block') {
            return;
        }
        $log.log('watch workspace');
        var script = store.get('script');
        var xml = Blockly.Xml.workspaceToDom(vm.workspace);
        script.mode = 'block';
        script.xml = Blockly.Xml.domToText(xml);
        script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        store.set('script', script);
    }

    function loadUserDevices() {
        $log.log('loadUserDevices');
        deviceService.getAllDevices().then(function success(devices) {
            if (devices.length) {
                vm.devices = devices;
                $log.log(vm.devices);
                loadSelectedDevice();
                subscribeDeviceTopics();
            }
        });
    }

    function loadSelectedDevice() {
        var selectedDeviceId = store.get('selectedDeviceId');
        if (selectedDeviceId) {
            for (var i = 0; i < vm.devices.length; i++) {
                if (selectedDeviceId === vm.devices[i].id) {
                    vm.currentDevice = vm.devices[i];
                }
            }
        }
    }

    function subscribeDeviceTopics() {
        var chipId = '';
        if (mqttClient && mqttClient.connected) {
            for (var i = 0; i < vm.devices.length; i++) {
                chipId = vm.devices[i].chipId;
                var logTopic = baseTopicUrl + chipId + '/log';
                var offlineTopic = baseTopicUrl + chipId + '/offline';
                var otaAckTopic = baseTopicUrl + chipId + '/ota_ack';
                mqttClient.unsubscribe(logTopic);
                mqttClient.unsubscribe(offlineTopic);
                mqttClient.unsubscribe(otaAckTopic);
                mqttClient.subscribe(logTopic, {
                    qos: 2
                });
                mqttClient.subscribe(offlineTopic, {
                    qos: 2
                });
                mqttClient.subscribe(otaAckTopic, {
                    qos: 2
                });
                $log.log('subscribe', chipId, '/log', '/offline', '/ota_ack');
            }
        }
        var registerTopic = baseTopicUrl + 'register';
        mqttClient.unsubscribe(registerTopic);
        mqttClient.subscribe(registerTopic, {
            qos: 2
        });
    }

    function changeMode($event) {
        $log.log('changeMode');
        if (vm.script.mode === 'lua') {
            if (vm.script.lua !== Blockly.Lua.workspaceToCode(vm.workspace)) {
                var confirm = $mdDialog.confirm()
                    .title($translate.instant('script.confirm-convert-title'))
                    .htmlContent($translate.instant('script.confirm-convert-content'))
                    .targetEvent($event)
                    .ok($translate.instant('script.confirm-convert-ok'))
                    .cancel($translate.instant('script.confirm-convert-cancel'));

                $mdDialog.show(confirm).then(function () {
                    restoreBlockMode();
                });
            } else {
                restoreBlockMode();
            }
        } else {
            vm.script.mode = 'lua';
            vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        }
    }

    function restoreBlockMode() {
        vm.script.mode = 'block';
        $timeout(function () {
            if (document.getElementById('blocklyDiv').clientHeight === 0) {
                onResize();
            }
        });
    }

    function saveProject() {
        $mdDialog.hide();
        if (vm.isUserLoaded) {
            var xml = Blockly.Xml.workspaceToDom(vm.workspace);
            vm.script.xml = Blockly.Xml.domToText(xml);
            if (vm.script.mode === 'block') {
                vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
            }

            if (angular.isUndefined(vm.script.id)) { // New project
                addProject();
            } else { // Existing project
                scriptService.saveScript(vm.script);
            }
        } else {
            $rootScope.login();
        }
    }

    function saveProjectMobile() {
        if (!vm.script.name) {
            $mdDialog.show({
                controller: () => this,
                controllerAs: 'vm',
                templateUrl: saveProjectMobileTemplate,
                parent: angular.element($document[0].body),
                fullscreen: false
            }).then(function () {}, function () {});
        } else {
            saveProject();
        }
    }

    function renameProject() {
        $mdBottomSheet.hide();
        $mdDialog.show({
            controller: () => this,
            controllerAs: 'vm',
            templateUrl: saveProjectMobileTemplate,
            parent: angular.element($document[0].body),
            fullscreen: false
        }).then(function () {}, function () {});
    }

    function addProject() {
        scriptService.addScript(vm.script).then(
            function success(script) {
                vm.script.id = script.id;
                store.set('script', vm.script);
                $location.path('/codelab/' + script.id);
            },
            function fail() {
                toast.showError($translate.instant('script.script-save-failed-error'));
            }
        );
    }

    function uploadScript() {
        var chipId = vm.currentDevice.chipId;
        var topic = baseTopicUrl + chipId + '/ota';
        if (vm.script.mode === 'block') {
            vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        }
        if (vm.script.lua.length === 0) {
            return;
        }
        if (mqttClient && mqttClient.connected && chipId) {
            $log.log('size of lua script', byteLength(vm.script.lua));
            var maxSize = settings.maxBytesUpload;

            if (byteLength(vm.script.lua) < maxSize) {
                vm.isUploadSuccess = false;
                mqttClient.publish(topic, vm.script.lua, null, function (err) {
                    if (err) {
                        toast.showError($translate.instant('script.script-upload-failed-error'));
                    }
                    $timeout(function () {
                        if (!vm.isUploadSuccess) {
                            toast.showError($translate.instant('script.script-upload-failed-error'));
                        }
                    }, 5000);
                });
            } else {
                var splitedStrings = splitString(vm.script.lua, maxSize);
                for (var i = 0; i < splitedStrings.length; i++) {
                    var sharedTopic = topic + '/' + (i + 1).toString();
                    if (i === splitedStrings.length - 1) {
                        sharedTopic = topic + '/$';
                    }
                    $log.log('sharedTopic', sharedTopic);
                    mqttClient.publish(sharedTopic, splitedStrings[i], null, function (err) {
                        if (err) {
                            toast.showError($translate.instant('script.script-upload-failed-error'));
                        } else {
                            toast.showSuccess($translate.instant('script.script-upload-success'));
                        }
                    });
                }
            }
        } else {
            toast.showError($translate.instant('script.script-upload-failed-error'));
        }
    }

    function newProject() {
        store.set('script', emptyScript);
        $mdBottomSheet.hide();
        $state.go('home.codelab.new');
    }

    function openProject($event) {
        $mdBottomSheet.hide();
        if (vm.isUserLoaded) {
            $mdDialog.show({
                controller: OpenProjectController,
                controllerAs: 'vm',
                templateUrl: openProjectTemplate,
                parent: angular.element($document[0].body),
                fullscreen: true,
                targetEvent: $event
            }).then(function () {}, function () {});
        } else {
            $rootScope.login();
        }
    }

    function deleteProject($event) {
        $mdBottomSheet.hide();
        var confirm = $mdDialog.confirm()
            .targetEvent($event)
            .title($translate.instant('project.delete-project-title', {
                projectName: vm.script.name
            }))
            .htmlContent($translate.instant('project.delete-project-text'))
            .ariaLabel($translate.instant('action.delete'))
            .cancel($translate.instant('action.cancel'))
            .ok($translate.instant('action.delete'));
        $mdDialog.show(confirm).then(function () {
                scriptService.deleteScript(vm.script.id).then(function success() {
                    newProject();
                });
            },
            function () {});
    }

    function toggleSidenav() {
        if ($mdSidenav('right').isLockedOpen()) {
            vm.isSidenavOpen = false;
        } else {
            vm.isSidenavOpen = true;
        }
        $timeout(function () {
            onResize();
        }, 500);
    }

    function cancel() {
        $mdDialog.cancel();
    }

    function showBottomSheetActions() {
        $mdBottomSheet.show({
            templateUrl: bottomSheetActionsTemplate,
            controller: () => this,
            controllerAs: 'vm',
        }).then(function () {}).catch(function () {});
    }

    function showDeviceLog() {
        $mdBottomSheet.show({
            templateUrl: bottomSheetDeviceLogTemplate,
            controller: () => this,
            controllerAs: 'vm',
        }).then(function () {}).catch(function () {});
    }

    function renameDevice() {
        $mdBottomSheet.hide();
        $mdDialog.show({
            controller: () => this,
            controllerAs: 'vm',
            templateUrl: renameDeviceTemplate,
            parent: angular.element($document[0].body),
            fullscreen: false
        }).then(function () {}, function () {});
    }

    function deleteDevice($event) {
        $mdBottomSheet.hide();
        var confirm = $mdDialog.confirm()
            .targetEvent($event)
            .title($translate.instant('device.delete-device-title', {
                deviceName: vm.currentDevice.name
            }))
            .htmlContent($translate.instant('device.delete-device-text'))
            .ariaLabel($translate.instant('action.delete'))
            .cancel($translate.instant('action.cancel'))
            .ok($translate.instant('action.delete'));
        $mdDialog.show(confirm).then(function () {
                deviceService.deleteDevice(vm.currentDevice.id).then(function success() {
                    $state.go($state.current, null, {
                        reload: true
                    });
                });
            },
            function () {});
    }

    function addDevice($event) {
        $mdBottomSheet.hide();
        $mdDialog.show({
                controller: RegisterNewDeviceController,
                controllerAs: 'vm',
                templateUrl: registerDeviceTemplate,
                parent: angular.element($document[0].body),
                fullscreen: false,
                targetEvent: $event
            })
            .then(function () {}, function () {});

    }

    function saveDevice() {
        deviceService.saveDevice(vm.currentDevice);
        $mdDialog.hide();
    }

    function downloadProject() {
        if (vm.script.mode === 'block') {
            vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        }
        exportToPc(vm.script.lua, vm.script.name + '.lua');
    }

    function exportToPc(data, filename) {
        if (!data) {
            return;
        }

        if (!filename) {
            filename = 'download.txt';
        }

        var blob = new Blob([data], {
            type: 'text/plain'
        });

        // FOR IE:
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
            e.initEvent('click', true, false, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    }

    function clearDeviceLog() {
        if (vm.currentDevice) {
            store.set('deviceLog_' + vm.currentDevice.chipId, '');
            vm.currentLog = '';
        }
    }

    function byteLength(str) {
        // returns the byte length of an utf8 string
        var s = str.length;
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) s++;
            else if (code > 0x7ff && code <= 0xffff) s += 2;
            if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
        }
        return s;
    }

    function splitString(str, size) {
        var output = [];
        var lines = str.split('\n');
        var strPart = '';
        var offsetBytes = 100;
        if (byteLength(str) < size) {
            output[0] = str;
            return output[0];
        } else {
            if (size - offsetBytes < 0) {
                size = offsetBytes;
            }
            for (var i = 0; i < lines.length; i++) {
                strPart = strPart.concat('\n', lines[i]);
                if (byteLength(strPart) > size) {
                    output.push(strPart);
                    strPart = '';
                } else if (i === lines.length - 1) {
                    output.push(strPart);
                }
            }
            return output;
        }
    }
}