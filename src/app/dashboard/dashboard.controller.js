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
import widgetLibrary from './widget-library.tpl.html';
import widgetConfig from './widget-config.tpl.html';
import widgetTemplates from './widget-templates.tpl.html';
import newDashboardTemplate from './new-dashboard.tpl.html';
import renameDashboardTemplate from './rename-dashboard.tpl.html';
import menuWidgetController from '../components/menu-widget/menu-widget.controller.js';
import menuWidgetTemplate from '../components/menu-widget/menu-widget.tpl.html';
import moment from 'moment';
import nipplejs from 'nipplejs/dist/nipplejs.js';

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
export default function DashboardController($scope, userService, dashboardService, store, $window, $mdMedia, $mdSidenav, $document, $timeout, $mdDialog, $rootScope, $translate, toast, $state, settings, Fullscreen, $log, menuWidgetService, $mdBottomSheet, $interval) {
    var vm = this;
    var mqttClient;
    var authKey = '';
    var baseUserTopicUrl = '';

    vm.widgetLibrary = widgetLibrary;
    vm.widgetConfig = widgetConfig;
    vm.widgetTemplates = widgetTemplates;
    vm.dashboards = [];
    vm.currentDashboard = {};
    vm.selectedWidget;
    vm.selectedWidgetIndex;
    vm.currentDashboard.content = [];
    vm.currentDashboard.subscribedTopics = [];
    vm.editMode = false;
    vm.isUserLoaded = userService.isAuthenticated();
    vm.selectedColor = '';

    if (vm.isUserLoaded) {
        authKey = userService.getCurrentUser().authKey;
        baseUserTopicUrl = authKey + '/user/';
        loadUserDashboards();
    } else {
        vm.dashboards = [{
            id: 'demo',
            name: 'Demo dashboard',
            content: [{
                name: 'Play Music',
                type: 'button',
                icon: 'icon-play-button',
                bgColor: '#e91e63',
                publishMessage: {
                    topic: 'playMusic',
                    message: 'Hello'
                },
                cols: 2,
                rows: 2,
                maxItemCols: 4,
                y: 0,
                x: 0
            }]
        }];
        vm.currentDashboard = vm.dashboards[0];
    }

    vm.gridsterOptions = {
        gridType: 'scrollVertical',
        mobileBreakpoint: 0,
        margin: 4,
        minCols: 16,
        maxCols: 16,
        //compactType: 'compactUp', // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
        outerMargin: true,
        draggable: {
            enabled: false
        },
        resizable: {
            enabled: false
        },
        pushItems: true
    };

    vm.lineChartOptions = {
        scales: {
            yAxes: [{
                type: 'linear',
                display: true,
                position: 'left'
            }]
        }
    }

    vm.timezones = [{
            name: '−12.00',
            value: '-12.00'
        },
        {
            name: '−11.00',
            value: '-11.00'
        },
        {
            name: '−10.00',
            value: '-10.00'
        },
        {
            name: '−09.30',
            value: '-9.30'
        },
        {
            name: '−09.00',
            value: '-9'
        },
        {
            name: '−08.00',
            value: '-8'
        },
        {
            name: '−07.00',
            value: '-7'
        },
        {
            name: '−06.00',
            value: '-6'
        },
        {
            name: '−05.00',
            value: '-5'
        },
        {
            name: '−04.30',
            value: '-4.3'
        },
        {
            name: '−04.00',
            value: '-4'
        },
        {
            name: '−03.30',
            value: '-3.3'
        },
        {
            name: '−03.00',
            value: '-3'
        },
        {
            name: '−02.00',
            value: '-2'
        },
        {
            name: '−01.00',
            value: '-1'
        },
        {
            name: 'GMT(00.00)',
            value: '0'
        },
        {
            name: '+01.00',
            value: '1'
        },
        {
            name: '+02.00',
            value: '2'
        },
        {
            name: '+03.00',
            value: '3'
        },
        {
            name: '+03.30',
            value: '3.30'
        },
        {
            name: '+04.00',
            value: '4'
        },
        {
            name: '+04.30',
            value: '4.30'
        },
        {
            name: '+05.00',
            value: '5'
        },
        {
            name: '+05.30',
            value: '5.30'
        },
        {
            name: '+05.45',
            value: '5.45'
        },
        {
            name: '+06.00',
            value: '6.00'
        },
        {
            name: '+06.30',
            value: '6.30'
        },
        {
            name: '+07.00',
            value: '7'
        },
        {
            name: '+08.00',
            value: '8'
        },
        {
            name: '+08.45',
            value: '8.45'
        },
        {
            name: '+09.00',
            value: '9'
        },
        {
            name: '+09.30',
            value: '9.30'
        },
        {
            name: '+10.00',
            value: '10'
        },
        {
            name: '+10.30',
            value: '10.30'
        },
        {
            name: '+11.00',
            value: '11'
        },
        {
            name: '+11.30',
            value: '11.30'
        },
        {
            name: '+12.00',
            value: '12'
        },
        {
            name: '+12.45',
            value: '12.45'
        },
        {
            name: '+13.00',
            value: '13'
        },
        {
            name: '+14.00',
            value: '14'
        }
    ];

    $timeout(function () {
        onresize();
    });

    $scope.$watch(() => this.currentDashboard, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            if (vm.currentDashboard.id) {
                store.set('selectedDashboardId', vm.currentDashboard.id);
            }
        }
    });

    $scope.$on("$destroy", function () {
        if (mqttClient) {
            mqttClient.end();
        }
    });

    vm.defaultSliderValue = 50;

    vm.addNewDashboard = addNewDashboard;
    vm.addDashboard = addDashboard;
    vm.editDashboard = editDashboard;
    vm.saveDashboard = saveDashboard;
    vm.runDashboard = runDashboard;
    vm.renameDashboard = renameDashboard;
    vm.deleteDashboard = deleteDashboard;
    vm.toggleWidgetList = toggleWidgetList;
    vm.toggleWidgetConfig = toggleWidgetConfig;
    vm.addWidget = addWidget;
    vm.widgetAction = widgetAction;
    vm.removeWidget = removeWidget;
    vm.cancel = cancel;
    vm.closeWidgetLibrarySideNav = closeWidgetLibrarySideNav;
    vm.closeWidgetConfigSideNav = closeWidgetConfigSideNav;
    vm.toggleFullScreen = toggleFullScreen;
    vm.Fullscreen = Fullscreen;
    vm.polylineMap = polylineMap;
    vm.viewPolylineMapChecking = viewPolylineMapChecking;
    vm.setColor = setColor;
    vm.initMap = initMap;
    vm.editMenuWidget = editMenuWidget;
    vm.showMenuWidget = showMenuWidget;

    function closeWidgetLibrarySideNav() {
        $mdSidenav('widget-library').close();
    }

    function closeWidgetConfigSideNav() {
        $mdSidenav('widget-config').close();
    }

    function loadUserDashboards() {
        dashboardService.getAllDashboards().then(function success(data) {
            var dashboards = data.dashboards;
            var selectedDashboardId = store.get('selectedDashboardId');
            var selectedDashboardIndex = undefined;
            for (var i = 0; i < dashboards.length; i++) {
                if (dashboards[i].id === selectedDashboardId) {
                    selectedDashboardIndex = i;
                }
                var content = angular.fromJson(dashboards[i].content);
                if (content instanceof Array) {
                    dashboards[i].content = content;
                } else {
                    dashboards[i].content = [];
                }
            }

            vm.dashboards = dashboards;
            if (angular.isDefined(selectedDashboardIndex)) {
                vm.currentDashboard = vm.dashboards[selectedDashboardIndex];
            } else {
                vm.currentDashboard = vm.dashboards[0];
            }

            try {
                if (angular.isDefined(mqtt)) {
                    mqttClient = mqtt.connect(settings.mqtt.url, {
                        host: settings.mqtt.host,
                        port: settings.mqtt.port,
                        username: '',
                        password: authKey
                    });
                    mqttClient.on('connect', function () {
                        subscribeDashboardsTopics(data.data);
                    });
                    mqttClient.on('message', function (topic, message) {
                        $timeout(function () {
                            topic = topic.replace(baseUserTopicUrl, '');
                            message = message.toString();
                            $log.log('Dashboard Recieved Message:', topic, message);
                            updateDashboardData(topic, message);
                        });
                    });
                }
            } catch (err) {
                $log.log('Exception:', err.message);
            }

            initDashboardData(data.data);
        });
    }

    function addNewDashboard() {
        vm.newDashboard = null;
        if (vm.isUserLoaded) {
            $mdDialog.show({
                controller: () => this,
                controllerAs: 'vm',
                templateUrl: newDashboardTemplate,
                parent: angular.element($document[0].body),
                fullscreen: false
            }).then(function () {}, function () {});
        } else {
            $rootScope.login();
        }
    }

    function saveDashboard() {
        saveSubscribedTopics();
        dashboardService.saveDashboard(vm.currentDashboard).then(
            function success(data) {
                initDashboardData(data.data);
            },
            function fail() {
                toast.showError($translate.instant('dashboard.dashboard-save-failed-error'));
            }
        );
        $mdDialog.hide();
    }

    function addDashboard() {
        $mdDialog.hide();
        vm.newDashboard.content = [];
        dashboardService.addDashboard(vm.newDashboard).then(
            function success() {
                $state.go($state.current, vm.editDashboard(), {
                    reload: true
                });
            },
            function fail() {
                toast.showError($translate.instant('dashboard.dashboard-save-failed-error'));
            }
        );
    }

    function editDashboard() {
        vm.editMode = true;
        vm.gridsterOptions.draggable.enabled = true;
        vm.gridsterOptions.resizable.enabled = true;
        if (angular.isDefined(vm.gridsterOptions.api)) {
            if (isMobileDevice()) {
                vm.gridsterOptions.draggable.delayStart = 300;
                vm.gridsterOptions.resizable = {
                    enabled: true,
                    handles: {
                        s: false,
                        e: true,
                        n: false,
                        w: true,
                        se: true,
                        ne: true,
                        sw: true,
                        nw: true
                    }
                }
            }
            vm.gridsterOptions.api.optionsChanged();
        }
    }

    function renameDashboard() {
        $mdDialog.show({
            controller: () => this,
            controllerAs: 'vm',
            templateUrl: renameDashboardTemplate,
            parent: angular.element($document[0].body),
            fullscreen: false
        }).then(function () {}, function () {});
    }

    function deleteDashboard($event) {
        var confirm = $mdDialog.confirm()
            .targetEvent($event)
            .title($translate.instant('dashboard.delete-dashboard-title', {
                dashboardName: vm.currentDashboard.name
            }))
            .htmlContent($translate.instant('dashboard.delete-dashboard-text'))
            .ariaLabel($translate.instant('action.delete'))
            .cancel($translate.instant('action.cancel'))
            .ok($translate.instant('action.delete'));
        $mdDialog.show(confirm).then(function () {
                dashboardService.deleteDashboard(vm.currentDashboard.id).then(function success() {
                    $state.go($state.current, null, {
                        reload: true
                    });
                });
            },
            function () {});
    }

    function runDashboard() {
        vm.editMode = false;
        vm.gridsterOptions.draggable.enabled = false;
        vm.gridsterOptions.resizable.enabled = false;
        if (angular.isDefined(vm.gridsterOptions.api)) {
            vm.gridsterOptions.api.optionsChanged();
        }
        if (vm.isUserLoaded) {
            saveDashboard();
        }
    }

    function onresize() {
        if ($mdMedia('gt-sm')) {
            vm.gridsterOptions.minCols = 16;
            vm.gridsterOptions.maxCols = 16;
        } else if ($mdMedia('sm')) {
            vm.gridsterOptions.minCols = 8;
            vm.gridsterOptions.maxCols = 8;
        } else {
            vm.gridsterOptions.minCols = 4;
            vm.gridsterOptions.maxCols = 4;
        }
        if (angular.isDefined(vm.gridsterOptions.api)) {
            vm.gridsterOptions.api.optionsChanged();
        }
    }

    function toggleWidgetList() {
        $mdSidenav('widget-library').toggle();
    }

    function toggleWidgetConfig(index) {
        if (!vm.editMode) {
            return;
        }
        vm.selectedWidget = vm.currentDashboard.content[index];
        vm.selectedWidgetIndex = index;
        $mdSidenav('widget-config').toggle();
    }

    function addWidget(type) {
        if (type === 'button') {
            vm.currentDashboard.content.push({
                name: 'Button',
                type: 'button',
                icon: 'icon-play-button',
                bgColor: '#e91e63',
                publishMessage: {
                    topic: '',
                    message: ''
                },
                cols: 2,
                rows: 2,
                maxItemCols: 4
            })
        } else if (type === 'switch') {
            vm.currentDashboard.content.push({
                name: 'Switch',
                type: 'switch',
                icon: 'icon-switch',
                bgColor: '#e91e63',
                value: false,
                subscribeMessage: {
                    topic: '',
                    dataType: '1',
                    onMessage: '',
                    offMessage: ''
                },
                cols: 2,
                rows: 2,
                minItemCols: 2,
                minItemRows: 2,
                maxItemCols: 4
            })
        } else if (type === 'slider') {
            vm.currentDashboard.content.push({
                name: 'Slider',
                type: 'slider',
                icon: 'icon-volume-medium',
                bgColor: '#e91e63',
                min: 0,
                max: 100,
                value: 0,
                subscribeMessage: {
                    topic: '',
                    dataType: '1'
                },
                cols: 2,
                rows: 2,
                minItemCols: 2,
                minItemRows: 2,
                maxItemCols: 4
            })
        } else if (type === 'gauge') {
            vm.currentDashboard.content.push({
                name: 'Gauge',
                type: 'gauge',
                icon: 'icon-volume-medium',
                bgColor: '#2196f3',
                displayFormat: '',
                size: 120,
                min: 0,
                max: 100,
                value: 0,
                unit: '',
                subscribeMessage: {
                    topic: '',
                    dataType: '1'
                },
                cols: 2,
                rows: 2,
                maxItemCols: 4
            })
        } else if (type === 'valuedisplay') {
            vm.currentDashboard.content.push({
                name: 'Value Display',
                type: 'valuedisplay',
                icon: 'icon-hot-thermometer',
                bgColor: '#2196f3',
                displayFormat: '',
                subscribeMessage: {
                    topic: '',
                    dataType: '1'
                },
                value: '',
                cols: 2,
                rows: 2,
                maxItemCols: 4
            })
        } else if (type === 'chart') {
            vm.currentDashboard.content.push({
                name: 'Chart',
                type: 'chart',
                bgColor: '#ffffff',
                labels: [],
                data: [
                    []
                ],
                subscribeMessage: {
                    topic: '',
                    dataType: '4h'
                },
                cols: 4,
                rows: 3,
                maxItemCols: 8
            })
        } else if (type === 'stepControl') {
            vm.currentDashboard.content.push({
                name: 'Step Control',
                type: 'stepControl',
                icon: 'icon-sun',
                bgColor: '#e91e63',
                steps: 1,
                min: 0,
                max: 100,
                value: 0,
                subscribeMessage: {
                    topic: '',
                    dataType: '1'
                },
                cols: 2,
                rows: 3,
                minItemCols: 2,
                minItemRows: 3
            })
        } else if (type === 'colorPicker') {
            vm.currentDashboard.content.push({
                name: 'Color Picker',
                type: 'colorPicker',
                icon: 'icon-sun',
                bgColor: '#9e9e9e',
                color: '',
                displayColor: {},
                subscribeMessage: {
                    topic: '',
                },
                cols: 2,
                rows: 2,
                minItemCols: 2,
            })
        } else if (type === 'gmap') {
            vm.currentDashboard.content.push({
                id: Math.round((new Date()).getTime() / 1000),
                name: 'Map',
                type: 'gmap',
                bgColor: '#2196f3',
                subscribeMessage: {
                    topic: '',
                    dataType: '1'
                },
                listCoordinates: [],
                Coordinates: {},
                cols: 4,
                rows: 3,
                viewPolylineMap: false,
                minItemCols: 4,
                minItemRows: 3
            })
        } else if (type === 'clock') {
            vm.currentDashboard.content.push({
                name: 'Ho Chi Minh',
                type: 'clock',
                bgColor: '#2196f3',
                timezone: '+07.00',
                cols: 2,
                rows: 2,
                minItemCols: 2,
                minItemRows: 1
            })
        } else if (type === 'menu') {
            var menu = {
                name: 'Menu',
                type: 'menu',
                icon: 'icon-list-ol',
                bgColor: '#e91e63',
                pendingItem: {
                    message: '',
                    label: '',
                    pending: true,
                    type: 'pendingItem'
                },
                actionList: [{
                        message: 'general',
                        label: 'General'
                    },
                    {
                        message: 'loud',
                        label: 'Loud'
                    },
                    {
                        message: 'silent',
                        label: 'Silent'
                    },
                ],
                subscribeMessage: {
                    topic: '',
                    message: '',
                    dataType: '1',
                },
                cols: 2,
                rows: 2,
                minItemCols: 2,
                minItemRows: 2,
                maxItemCols: 4
            };
            vm.currentDashboard.content.push(menu);
            menuWidgetService.saveData(menu.actionList);
        } else if (type === 'joystick') {
            var joystick = {
                name: 'Joystick',
                type: 'joystick',
                bgColor: '#e91e63',
                control: '',
                itv: '',
                id: Math.round((new Date()).getTime() / 1000),
                options: {
                    zone: null,
                    color: 'white',
                    mode: 'dynamic',
                },
                position: {
                    x: 0,
                    y: 0
                },
                newangle: '',
                angle: '',
                subscribeMessage: {
                    topic: '',
                    message: '',
                },
                cols: 2,
                rows: 2,
                minItemCols: 2,
                minItemRows: 2,
                maxItemCols: 4,
                maxItemRows: 4,
            }
            vm.currentDashboard.content.push(joystick);
            initJoystick(joystick);
        }
        $mdSidenav('widget-library').close();
    }

    function widgetAction(widget, option) {
        if (vm.editMode) {
            return;
        }
        if (widget.type === 'button') {
            sendMessage(widget.publishMessage.topic, widget.publishMessage.message.toString());
        } else if (widget.type === 'switch') {
            widget.value = !widget.value;
            if (widget.value === true) {
                sendMessage(widget.subscribeMessage.topic, widget.subscribeMessage.onMessage.toString());
            } else {
                sendMessage(widget.subscribeMessage.topic, widget.subscribeMessage.offMessage.toString());
            }
        } else if (widget.type === 'slider') {
            sendMessage(widget.subscribeMessage.topic, widget.value.toString());
        } else if (widget.type === 'stepControl') {
            if (widget.steps === 0 || widget.min > widget.max) {
                return;
            }
            var currentValue = parseFloat(widget.value);
            widget.steps = parseFloat(widget.steps);
            widget.max = parseFloat(widget.max);
            widget.min = parseFloat(widget.min);

            if (option === 1) {
                currentValue = currentValue + widget.steps;
                if (currentValue > widget.max) {
                    currentValue = widget.max;
                }
            } else if (option === -1) {
                currentValue = currentValue - widget.steps;
                if (currentValue < widget.min) {
                    currentValue = widget.min;
                }
            } else {
                return;
            }

            widget.value = currentValue;

            sendMessage(widget.subscribeMessage.topic, widget.value.toString());
        } else if (widget.type === 'colorPicker') {
            sendMessage(widget.subscribeMessage.topic, widget.color.toString());
        } else if (widget.type === 'menu') {
            widget.name = option.label;
            widget.subscribeMessage.message = option.message;
            menuWidgetService.saveData(widget.actionList);
            sendMessage(widget.subscribeMessage.topic, widget.subscribeMessage.message.toString());
        }
    }

    function sendMessage(topic, message) {
        if (!vm.isUserLoaded || !topic.trim().length) {
            return;
        }
        if (!mqttClient || !mqttClient.connected) {
            $timeout(function () {
                sendMqttMessage(topic, message);
            }, 3000);
        } else {
            sendMqttMessage(topic, message);
        }

    }

    function sendMqttMessage(topic, message) {
        topic = baseUserTopicUrl + topic.trim();
        $log.log('Send Message', topic, message);
        if (mqttClient && mqttClient.connected) {
            mqttClient.publish(topic, message, null, function (err) {
                if (err) {
                    toast.showError($translate.instant('dashboard.send-message-failed-error'));
                }
            });
        } else {
            toast.showError($translate.instant('dashboard.send-message-failed-error'));
        }
    }

    function removeWidget() {
        vm.currentDashboard.content.splice(vm.selectedWidgetIndex, 1);
        $mdSidenav('widget-config').close()
            .then(function () {
                if (angular.isDefined(vm.gridsterOptions.api)) {
                    vm.gridsterOptions.api.optionsChanged();
                }
            });
    }

    function cancel() {
        $mdDialog.cancel();
    }

    function saveSubscribedTopics() {
        $log.log('saveSubscribedTopics');
        var subscribedTopics = [];
        for (var i = 0; i < vm.dashboards.length; i++) {
            if (vm.dashboards[i].content.length) {
                for (var j = 0; j < vm.dashboards[i].content.length; j++) {
                    var widget = vm.dashboards[i].content[j];
                    if (angular.isDefined(widget.subscribeMessage)) {
                        var topic = widget.subscribeMessage.topic.trim();
                        if (topic.length) {
                            subscribedTopics.push({
                                topic: widget.subscribeMessage.topic.trim(),
                                dataType: widget.subscribeMessage.dataType
                            });
                        }
                    }
                }
            }
        }
        vm.currentDashboard.subscribedTopics = filterDuplidatedTopics(subscribedTopics);

        if (mqttClient && mqttClient.connected) {
            for (var k = 0; k < vm.currentDashboard.subscribedTopics.length; k++) {
                var widgetTopic = vm.currentDashboard.subscribedTopics[k].topic;
                widgetTopic = baseUserTopicUrl + widgetTopic;
                mqttClient.unsubscribe(widgetTopic);
                $log.log('Save Subscribed Topics:', widgetTopic);
                mqttClient.subscribe(widgetTopic, {
                    qos: 2
                });
            }
        } else {
            $log.log('Save Subscribed Topics. Could not connect to mqtt');
        }
    }

    function updateDashboardData(topic, message) {
        for (var i = 0; i < vm.dashboards.length; i++) {
            if (vm.dashboards[i].content.length) {
                for (var j = 0; j < vm.dashboards[i].content.length; j++) {
                    var widget = vm.dashboards[i].content[j];
                    if (angular.isDefined(widget.subscribeMessage) && topic === widget.subscribeMessage.topic) {
                        if (widget.type === 'switch') {
                            if (widget.subscribeMessage.onMessage === message) {
                                widget.value = true;
                            } else {
                                widget.value = false;
                            }
                        } else if (widget.type === 'slider') {
                            widget.value = Number(message);
                        } else if (widget.type === 'chart') {
                            updateChartData(widget, message);
                        } else if (widget.type === 'colorPicker') {
                            widget.color = message;
                            widget.displayColor = hexToRgb(widget.color);
                        } else if (widget.type === 'gmap') {
                            updateMapData(widget, message);
                        } else if (widget.type === 'menu') {
                            updateMenuWidgetState(widget, message);
                        } else {
                            widget.value = message;
                        }
                    }
                }
            }
        }
    }

    function updateChartData(widget, value) {
        widget.labels.push(
            moment(Date.now()).format('MMM Do HH:mm')
        );
        widget.data[0].push(
            Number(value)
        );
    }

    function updateMapData(widget, value) {
        widget.listCoordinates.push(angular.fromJson(value));
        widget.Coordinates = angular.fromJson(value);

        if (widget.viewPolylineMap === true) {
            vm.polylineMap(widget.listCoordinates, widget.id);
        } else if (widget.viewPolylineMap === false) {
            vm.initMap(angular.fromJson(widget.Coordinates), widget.id);
        }
    }

    function subscribeDashboardsTopics(data) {
        for (var i = 0; i < data.length; i++) {
            var topic = baseUserTopicUrl + data[i].topic;
            mqttClient.unsubscribe(topic);
            $log.log('Subscribe Dashboards Topics:', topic);
            mqttClient.subscribe(topic, {
                qos: 2
            });
        }
    }

    function initDashboardData(data) {
        if (!data.length) {
            return;
        }
        for (var i = 0; i < vm.dashboards.length; i++) {
            if (vm.dashboards[i].content.length) {
                for (var j = 0; j < vm.dashboards[i].content.length; j++) {
                    var widget = vm.dashboards[i].content[j];
                    if (angular.isDefined(widget.subscribeMessage)) {
                        var wantedData = data.filter(function (item) {
                            return item.topic === widget.subscribeMessage.topic && item.dataType === widget.subscribeMessage.dataType;
                        });
                        if (wantedData.length) {
                            if (wantedData[0].data.length) {
                                var singleValue = wantedData[0].data[0].data;

                                if (widget.type === 'switch') {
                                    if (widget.subscribeMessage.onMessage === singleValue) {
                                        widget.value = true;
                                    } else {
                                        widget.value = false;
                                    }
                                } else if (widget.type === 'slider') {
                                    widget.value = Number(singleValue);
                                } else if (widget.type === 'chart') {
                                    initChartData(widget, wantedData[0].data);
                                } else if (widget.type === 'colorPicker') {
                                    widget.color = singleValue;
                                    widget.displayColor = hexToRgb(widget.color);
                                } else if (widget.type === 'gmap') {
                                    initMapData(widget, wantedData[0].data);
                                } else if (widget.type === 'menu') {
                                    updateMenuWidgetState(widget, singleValue);
                                } else if (widget.type === 'joystick') {
                                    initJoystick(widget);
                                } else {
                                    widget.value = singleValue;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function initChartData(widget, data) {
        var labels = [];
        var chartData = [];
        data.sort(predicateBy('createdAt'));
        for (var i = 0; i < data.length; i++) {
            labels.push(
                moment(data[i].createdAt).format('MMM Do HH:mm')
            );
            chartData.push(
                data[i].data
            );
        }
        widget.labels = labels;
        widget.data[0] = chartData;
    }

    function initMapData(widget, data) {
        widget.Coordinates = angular.fromJson(data[0].data);
        $timeout(function () {
            if ($('#' + widget.id).is(':visible')) { //if the container is visible on the page
                if (widget.viewPolylineMap === true) {
                    vm.polylineMap(widget.listCoordinates, widget.id);
                } else if (widget.viewPolylineMap === false) {
                    vm.initMap(angular.fromJson(widget.Coordinates), widget.id);
                }
            }
        }, 1000);
    }

    function filterDuplidatedTopics(data) {
        var topics = {};
        data.forEach(function (item) {
            var topic = topics[item.topic] = topics[item.topic] || {};
            topic[item.dataType] = true;
        });

        var outputList = [];
        for (var topic in topics) {
            for (var dataType in topics[topic]) {
                outputList.push({
                    topic: topic,
                    dataType: dataType
                });
            }
        }

        return outputList;
    }

    function toggleFullScreen() {
        if (Fullscreen.isEnabled()) {
            Fullscreen.cancel();
        } else {
            Fullscreen.all();
        }
    }

    function predicateBy(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    function isMobileDevice() {
        return angular.isDefined(window.orientation) || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    function initMap(coordinates, id) {
        vm.map = new google.maps.Map(document.getElementById(id), {
            center: coordinates,
            zoom: 15,
        });
        vm.gmapWidgetMode = true;
        vm.marker = new google.maps.Marker({
            position: coordinates,
            map: vm.map
        });
    }

    function polylineMap(coordinates, id) {
        vm.map = new google.maps.Map(document.getElementById(id), {
            zoom: 3,
            center: coordinates[coordinates.length - 1],
            mapTypeId: 'terrain',
        });
        vm.gmapWidgetMode = false;
        vm.flightPath = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        vm.flightPath.setMap(vm.map);
    }

    function viewPolylineMapChecking(widget) {
        if (widget.viewPolylineMap === true) {
            vm.polylineMap(widget.listCoordinates, widget.id);
        } else {
            vm.initMap(widget.Coordinates, widget.id);
        }
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            red: parseInt(result[1], 16),
            green: parseInt(result[2], 16),
            blue: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(rgb) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }
        return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    function setColor($event, widget) {
        var selectedColor = $event.currentTarget.querySelector('button').style.backgroundColor;
        widget.color = rgbToHex(selectedColor);
        widget.displayColor = hexToRgb(widget.color);

        widgetAction(widget);
    }

    function editMenuWidget(widget, command) {
        if (command === "add") {
            widget.actionList.push({
                label: '',
                message: ''
            });
        } else {
            widget.actionList.splice(command, 1);
        }
    }

    function showMenuWidget(item) {
        if (vm.editMode) {
            return;
        }
        menuWidgetService.saveData(item.actionList);
        $mdBottomSheet.show({
            templateUrl: menuWidgetTemplate,
            controller: menuWidgetController,
            controllerAs: 'vm',
            clickOutsideToClose: true
        }).then(function (clickedItem) {
            widgetAction(item, {
                message: clickedItem.message,
                label: clickedItem.label
            });
        });
    }

    function updateMenuWidgetState(widget, message) {
        for (var i = 0; i < widget.actionList.length; i++) {
            if (widget.actionList[i].message === message) {
                widget.name = widget.actionList[i].label;
            }
        }
    }

    function initJoystick(joystick) {
        joystick.itv = $interval(function () {
            if (joystick.angle !== joystick.newangle) {
                joystick.angle = joystick.newangle;
                sendMessage(joystick.subscribeMessage.topic, joystick.angle.toString());
            }
        }, 100);

        var itv = $interval(function () {
            var el = $document[0].getElementById('joystick' + joystick.id);
            if (el == null) {
                $log.log("Joystick returned as null.");
            } else {
                joystick.options.zone = el;
                joystick.control = nipplejs.create(joystick.options);

                joystick.control.on('move end', function (e, data) {
                    if (angular.isUndefined(data.direction)) {
                        joystick.newangle = "stop";
                    } else {
                        if (angular.isDefined(data.direction.angle)) {
                            joystick.newangle = data.direction.angle;
                        }
                    }
                });
                $interval.cancel(itv);
            }
        }, 1000);
    }
}