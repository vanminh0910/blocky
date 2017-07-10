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
/* eslint-disable import/no-unresolved, import/default */

/* eslint-enable import/no-unresolved, import/default */

export default angular.module('blocky.directives.blockly', [])
    .directive('tbBlockly', GoogleBlockly)
    .name;

/*@ngInject*/
function GoogleBlockly($document, $window, $timeout) {
    var Blockly = $window.Blockly;
    var linker = function (scope, element) {
        $timeout(function () {
            scope.workspace = Blockly.inject(element.children()[0], {
                grid:
                {
                    spacing: 25,
                    length: 3,
                    colour: '#ccc',
                    snap: true
                },
                toolbox: $document[0].getElementById('toolbox'),
                sounds: false,
                zoom:
                {
                    controls: true,
                    wheel: false
                },
                trashcan: true
            });
            
            scope.$watch('xmlText', function () {
                if (scope.xmlText) {
                    var xml = Blockly.Xml.textToDom(scope.xmlText);
                    Blockly.Xml.domToWorkspace(xml, scope.workspace);
                }
            });
        }, 1000);
        
        var onresize = function () {
            // Compute the absolute coordinates and dimensions of blocklyArea.
            var myelement = element.children()[0];
            myelement.style.height = ($window.innerHeight) + 'px';

        };
        $window.addEventListener('resize', onresize, false);
        onresize();
        scope.$on('$destroy', function () {
            var el = $document[0].querySelector('.blocklyToolboxDiv');
            if (el) {
                $document[0].querySelector('.blocklyToolboxDiv').remove();
            }
        });
    }

    return {
        restrict: "E",
        template: '<div style="height:80vh; margin-top: 50px; width: 90%;"></div>',
        link: linker,
        scope: {
            workspace: "=",
            xmlText: "="
        }
    };
}
