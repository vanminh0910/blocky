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

export default angular.module('blocky.directives.blockly', [])
    .directive('tbBlockly', GoogleBlockly)
    .name;

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
function GoogleBlockly($timeout, store, $stateParams, $log) {
    var linker = function (scope, element) {
        if (scope.mode !== 'block') {
            return;
        }
        $timeout(function () {
            scope.workspace = Blockly.inject(element.children()[0], {
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

            var localScript = store.get('script');
            if (angular.isUndefined($stateParams.scriptId) && angular.isDefined(localScript.xml)) {
                $log.log('load local');
                if (angular.isDefined(Blockly.mainWorkspace)) {
                    Blockly.mainWorkspace.clear();
                }
                var xml = Blockly.Xml.textToDom(localScript.xml);
                Blockly.Xml.domToWorkspace(xml, scope.workspace);
            }
            scope.$watch('xmlText', function (newValue, oldValue) {
                if (newValue && !angular.equals(newValue, oldValue)) {
                    $log.log('load xml');
                    if (Blockly.mainWorkspace !== null) {
                        Blockly.mainWorkspace.clear();
                    }
                    var xml = Blockly.Xml.textToDom(newValue);
                    Blockly.Xml.domToWorkspace(xml, scope.workspace);
                }
            });
            window.addEventListener('resize', onResize, false);
            $scope.$on("$destroy", function () {
                window.removeEventListener('resize', onResize, false);
            });
            onResize();

            scope.workspace.addChangeListener(onWorkspaceChange);
        }, 500);

        scope.$on('toggleSidenav', function () {
            $timeout(function () {
                onResize();
            }, 500);
        });

        function onResize() {
            var blocklyArea = document.getElementById('main-content');
            var blocklyDiv = element.children()[0];
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
            $log.log('size', blocklyDiv.style.width, blocklyDiv.style.height);
            if (scope.workspace) {
                Blockly.svgResize(scope.workspace);
            }
        }

        function onWorkspaceChange() {
            $log.log('watch workspace');
            var script = store.get('script');
            var xml = Blockly.Xml.workspaceToDom(scope.workspace);
            script.xml = Blockly.Xml.domToText(xml);
            script.lua = Blockly.Lua.workspaceToCode(scope.workspace);
            store.set('script', script);
        }
    }

    return {
        restrict: "E",
        template: '<div id="blocklyDiv" style="position: absolute"></div>',
        link: linker,
        scope: {
            workspace: "=",
            xmlText: "=",
            mode: "=",
        }
    };
}