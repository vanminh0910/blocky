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
import './board-select.scss';

import blockyApiBoard from '../api/board.service';

/* eslint-disable import/no-unresolved, import/default */

import boardSelectTemplate from './board-select.tpl.html';

/* eslint-enable import/no-unresolved, import/default */


export default angular.module('blocky.directives.boardSelect', [blockyApiBoard])
    .directive('tbBoardSelect', BoardSelect)
    .name;

/*@ngInject*/
function BoardSelect($compile, $templateCache, $q, types, boardService) {

    var linker = function (scope, element, attrs, ngModelCtrl) {
        var template = $templateCache.get(boardSelectTemplate);
        element.html(template);

        scope.boardId = null;

        var pageLink = {limit: 100};

        var promise;
        promise = boardService.getAllBoards(pageLink);

        promise.then(function success(result) {
            scope.boards = result.data;
        }, function fail() {
            scope.boards = [];
        });

        scope.updateView = function () {
            ngModelCtrl.$setViewValue(scope.boardId);
        }

        ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                scope.boardId = ngModelCtrl.$viewValue;
            } else {
                scope.boardId = null;
            }
        }

        scope.$watch('boardId', function () {
            scope.updateView();
        });

        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        require: "^ngModel",
        link: linker
    };
}
