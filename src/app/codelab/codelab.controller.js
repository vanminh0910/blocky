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
    var baseSysTopicUrl = '';

    vm.isUserLoaded = userService.isAuthenticated();
    if (vm.isUserLoaded) {
        authKey = userService.getCurrentUser().authKey;
        $rootScope.authKey = authKey;
        baseSysTopicUrl = authKey + '/sys';
    } else {
        vm.devices = [{
            id: 0,
            name: 'Demo device',
            status: 0
        }];
    }

    try {
        initMqttSession();
    } catch (err) {
        $log.log('Exception:', err.message);
    }

    vm.currentDevice = null;
    vm.currentLog = '';
    vm.isUploadSuccess = false;
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
    vm.script = {
        name: '',
        xml: '',
        lua: '',
        mode: 'block'
    };
    vm.isSidenavOpen = true;
    vm.blocklyToolbox = blocklyToolbox;
    vm.xmlText = '';
    vm.scriptId = $stateParams.scriptId;
    vm.localScript = store.get('script');
    vm.workspace = null;

    initScriptData();

    $scope.$watch(() => this.currentDevice, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            vm.currentLog = store.get('deviceLog_' + vm.currentDevice.chipId) || '';
            if (vm.currentDevice.id) {
                store.set('selectedDeviceId', vm.currentDevice.id);
            }
        }
    });

    $scope.$watch(() => this.xmlText, function (newValue, oldValue) {
        if (vm.workspace && !angular.equals(newValue, oldValue)) {
            if (Blockly.mainWorkspace !== null) {
                Blockly.mainWorkspace.clear();
            }
            var xml = Blockly.Xml.textToDom(newValue);
            Blockly.Xml.domToWorkspace(xml, vm.workspace);
        }
    });

    window.addEventListener('resize', onResize, false);
    $scope.$on("$destroy", function () {
        // Save project to local storage
        if (vm.workspace) {
            var xml = Blockly.Xml.workspaceToDom(vm.workspace);
            vm.script.xml = Blockly.Xml.domToText(xml);
            updateLuaFromBlock();
        }
        store.set('script', vm.script);

        // Clean up mqtt session
        if (mqttClient) {
            mqttClient.end();
        }
        window.removeEventListener('resize', onResize, false);
    });

    $timeout(function () {
        injectBlockly();
    }, 100);

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
    vm.duplicateProject = duplicateProject;

    function initMqttSession() {
        if (angular.isDefined(mqtt) && vm.isUserLoaded) {
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
                    try {
                        var chipId = '';
                        if (topic.indexOf('/log') > -1) {
                            message = message.toString();
                            chipId = topic.replace(baseSysTopicUrl, '').replace('/log', '').replace('/', '');
                            var deviceLog = store.get('deviceLog_' + chipId) || '';
                            if (vm.currentDevice && vm.currentDevice.chipId === chipId) {
                                vm.currentLog = deviceLog;
                            }
                        } else {
                            message = angular.fromJson(message.toString());
                            if (message.event === 'register') {
                                chipId = message.chipId;
                                updateDeviceStatusByChipId(chipId, 1);
                            } else if (message.event === 'offline') {
                                chipId = message.chipId;
                                updateDeviceStatusByChipId(chipId, 0);
                            } else if (message.event === 'ota_ack') {
                                vm.isUploadSuccess = true;
                                toast.showSuccess($translate.instant('script.script-upload-success'));
                            } else if (message.event === 'run_ack') {
                                vm.isUploadSuccess = true;
                                toast.showSuccess($translate.instant('script.script-upload-success'));
                            }
                        }
                    } catch (err) {
                        $log.log('error', err.message);
                    }
                }, 500);
            });
        }
    }

    function initScriptData() {
        if ($state.current.name === 'home.codelab.new') {
            store.remove('script');
            vm.script = {
                name: '',
                xml: '',
                lua: '',
                mode: 'block'
            };
            vm.xmlText = '';
        } else if (vm.scriptId) { // Load existing script
            scriptService.getScript(vm.scriptId).then(
                function success(script) {
                    vm.script.id = script.id;
                    vm.script.name = script.name;
                    vm.script.xml = script.xml || '';
                    vm.script.lua = script.lua || '';
                    vm.script.mode = script.mode || 'block';
                    if (vm.script.mode === 'block') {
                        vm.xmlText = vm.script.xml;
                        onResize();
                    }
                },
                function fail() {
                    toast.showError($translate.instant('script.script-load-failed-error'));
                }
            );
        } else if (vm.localScript) {
            vm.script = vm.localScript;
            if (vm.script.mode === 'block') {
                vm.xmlText = vm.script.xml;
            }
        }
    }

    function updateDeviceStatusByChipId(chipId, status) {
        vm.currentDevice = undefined;
        loadUserDevices();
        for (var i = 0; i < vm.devices.length; i++) {
            if (chipId.toString() === vm.devices[i].chipId.toString()) {
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
    }

    function injectBlockly() {
        if (!vm.workspace) {
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

            var blocklyArea = document.getElementById('main-content');
            if (blocklyArea.offsetHeight) {
                onResize();
            } else {
                $timeout(function () {
                    onResize();
                }, 500);
            }
        }
    }

    function onResize() {
        if (vm.script.mode !== 'block') {
            return;
        }
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
            var xml = Blockly.Xml.workspaceToDom(vm.workspace);
            if (vm.script.xml.length > (new XMLSerializer()).serializeToString(xml).length) {
                xml = Blockly.Xml.textToDom(vm.script.xml);
            }
            if (angular.isDefined(Blockly.mainWorkspace)) {
                Blockly.mainWorkspace.clear();
            }
            Blockly.Xml.domToWorkspace(xml, vm.workspace);
            Blockly.svgResize(vm.workspace);
        }
    }

    function loadUserDevices() {
        deviceService.getAllDevices().then(function success(devices) {
            if (devices.length) {
                vm.devices = devices;
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
        mqttClient.unsubscribe(baseSysTopicUrl);
        mqttClient.subscribe(baseSysTopicUrl, {
            qos: 2
        });

        var chipId = '';
        if (mqttClient && mqttClient.connected) {
            for (var i = 0; i < vm.devices.length; i++) {
                chipId = vm.devices[i].chipId;
                var logTopic = baseSysTopicUrl + '/' + chipId + '/log';
                mqttClient.unsubscribe(logTopic);
                mqttClient.subscribe(logTopic, {
                    qos: 2
                });
            }
        }
    }

    function changeMode($event) {
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
            updateLuaFromBlock();
            store.set('script', vm.script);
            if (angular.isUndefined(vm.script.id) || vm.script.id.length === 0) { // New project
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
                $location.path('/codelab/' + script.id);
            },
            function fail() {
                toast.showError($translate.instant('script.script-save-failed-error'));
            }
        );
    }

    function duplicateProject() {
        vm.script.name = vm.script.name + ' (Duplicated)';
        vm.script.id = '';
        //$location.path('/codelab/' + script.id);
        store.set('script', vm.script);
        $mdBottomSheet.hide();
        $state.go('home.codelab');
    }

    function uploadScript(mode) {
        var chipId = vm.currentDevice.chipId;
        var topic = baseSysTopicUrl + '/' + chipId + '/' + mode;
        updateLuaFromBlock();
        if (vm.script.lua.length === 0) {
            return;
        }
        if (mqttClient && mqttClient.connected && chipId) {
            var maxSize = settings.maxBytesUpload;

            vm.isUploadSuccess = false;
            if (byteLength(vm.script.lua) < maxSize) {
                mqttClient.publish(topic, vm.script.lua, null, function (err) {
                    if (err) {
                        toast.showError($translate.instant('script.script-upload-failed-error'));
                    }
                    $timeout(function () {
                        if (!vm.isUploadSuccess) {
                            toast.showError($translate.instant('script.script-upload-failed-error'));
                        }
                    }, 10000);
                });
            } else {
                var splitedStrings = splitString(vm.script.lua, maxSize);
                for (var i = 0; i < splitedStrings.length; i++) {
                    var sharedTopic = topic + '/' + (i + 1).toString();
                    if (i === splitedStrings.length - 1) {
                        sharedTopic = topic + '/$';
                    }
                    mqttClient.publish(sharedTopic, splitedStrings[i], null, function (err) {
                        if (err) {
                            toast.showError($translate.instant('script.script-upload-failed-error'));
                        }
                        $timeout(function () {
                            if (!vm.isUploadSuccess) {
                                toast.showError($translate.instant('script.script-upload-failed-error'));
                            }
                        }, 10000);
                    });
                }
            }
        } else {
            toast.showError($translate.instant('script.script-upload-failed-error'));
        }
    }

    function newProject() {
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
                fullscreen: true,
                targetEvent: $event
            })
            .then(function () {}, function () {});

    }

    function saveDevice() {
        deviceService.saveDevice(vm.currentDevice).then(
            function success() {
                var chipId = vm.currentDevice.chipId;
                var topic = baseSysTopicUrl + '/' + chipId + '/rename';
                mqttClient.publish(topic, vm.currentDevice.name, null, function () {
                });
            },
            function fail() {}
        );
        $mdDialog.hide();
    }

    function downloadProject() {
        updateLuaFromBlock();
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

    function updateLuaFromBlock() {
        if (vm.script.mode === 'block') {
            vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        }
    }
}