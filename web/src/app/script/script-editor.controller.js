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
import $ from 'jquery';
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/snippets/lua';
import 'ace-builds/src-min-noconflict/theme-github';
/* eslint-disable angular/angularelement */
import addScriptTemplate from './add-script.tpl.html';


/*@ngInject*/

export default function ScriptEditorController(scriptService, $stateParams, $rootScope, toast, $translate, $timeout, $window, $document, $mdDialog, $location, $scope, $log) {

    var scriptId = $stateParams.scriptId;
    var Blockly = $window.Blockly;
    var vm = this;
    vm.isToolbarOpened = true;
    vm.isEdit = true;
    vm.editMode = 'blockly';
    vm.script = {
        name: '',
        xml: '',
        lua: ''
    };
    vm.xmlText;

    vm.luaEditorOptions = {
        useWrapMode : true,
        showGutter: true,
        theme:'github',
        mode: 'lua',
        require: ['ace/ext/language_tools'],
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        }
    };
    vm.currentBoardId;

    if (scriptId) { // Load existing script
        $rootScope.loading = true;
        scriptService.getScript(scriptId).then(
            function success(script) {
                vm.script = script;
                vm.xmlText = vm.script.xml;
            },
            function fail() {
                toast.showError($translate.instant('script.script-load-failed-error'));
            }
        );
    }

    Object.defineProperty(vm, 'toolbarOpened', {
        get: function () { return vm.isToolbarOpened || vm.isEdit; },
        set: function () { }
    });

    vm.openToolbar = function () {
        $timeout(function () {
            vm.isToolbarOpened = true;
        });
    }

    vm.closeToolbar = function () {
        $timeout(function () {
            vm.isToolbarOpened = false;
        });
    }

    vm.uploadToBoard = uploadToBoard;
    vm.EditBlockly = EditBlockly;
    vm.EditLua = EditLua;
    vm.applyChanges = applyChanges;
    vm.cancel = cancel;
    vm.addScript = addScript;

    function uploadToBoard() {
        if (angular.isUndefined(vm.script._id)) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('')
                    .textContent($translate.instant('script.please-save-new-script'))
                    .ok($translate.instant('action.ok'))
            );
        } else if (!vm.currentBoardId) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('')
                    .textContent($translate.instant('script.please-select-board'))
                    .ok($translate.instant('action.ok'))
            );
        } else {
            var isScriptSaved = applyChanges();
            if (isScriptSaved) {
                var boardId = vm.currentBoardId;
                $rootScope.loading = true;
                scriptService.uploadScript(scriptId, boardId).then(
                    function success() {
                        toast.showSuccess($translate.instant('script.script-upload-success'));
                    },
                    function fail() {
                        toast.showError($translate.instant('script.script-upload-failed-error'));
                    }
                );
            } else {
                toast.showError($translate.instant('script.script-upload-failed-error'));
            }
        }

    }

    function EditBlockly($event) {
        // Check if user converts from Lua to Blockly
        $event.stopPropagation();
        if (vm.editMode === 'lua') {
            if (vm.script.lua !== Blockly.Lua.workspaceToCode(vm.workspace)) {
                var confirm = $mdDialog.confirm()
                    .title($translate.instant('script.confirm-convert-title'))
                    .htmlContent($translate.instant('script.confirm-convert-content'))
                    .targetEvent($event)
                    .ok($translate.instant('script.confirm-convert-ok'))
                    .cancel($translate.instant('script.confirm-convert-cancel'));

                $mdDialog.show(confirm).then(function () {
                    // Show blockly sidebar
                    $($document[0].querySelector('.blocklyToolboxDiv')).show();
                    vm.editMode = 'blockly';
                }, function () {
                    // Do nothing
                });
            } else {
                $($document[0].querySelector('.blocklyToolboxDiv')).show();
                vm.editMode = 'blockly';
            }

        }
    }

    function EditLua() {
        $log.log("edit LUA");
        // Hide blockly sidebar completely
        var el = $document[0].querySelector('.blocklyToolboxDiv');
        if (el) {
            $($document[0].querySelector('.blocklyToolboxDiv')).hide();
        }

        vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        vm.editMode = 'lua';

    }

    function applyChanges() {
        var xml = Blockly.Xml.workspaceToDom(vm.workspace);
        vm.script.xml = Blockly.Xml.domToText(xml);
        if (vm.editMode === 'blockly') {
            vm.script.lua = Blockly.Lua.workspaceToCode(vm.workspace);
        }

        if (angular.isUndefined(vm.script._id)) { // New script
            $mdDialog.show({
                controller: () => this,
                controllerAs: 'vm',
                templateUrl: addScriptTemplate,
                parent: angular.element($document[0].body),
                fullscreen: true
            }).then(function () {
            }, function () {
            });
        } else { // Existing script
            return scriptService.saveScript(vm.script);
        }
    }

    function addScript() {
        $mdDialog.hide();
        scriptService.addScript(vm.script).then(
            function success(script) {
                $location.path('/scripts/' + script._id);
            },
            function fail() {
                toast.showError($translate.instant('script.script-save-failed-error'));
            }
        );

    }
    function cancel() {
        $mdDialog.cancel();
    }

}

/* eslint-enable angular/angularelement */