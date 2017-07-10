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

import boardCard from './board-card.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function BoardController(boardService, userService, $state, $stateParams, $filter, $translate) {

    var boardActionsList = [
        {
            onAction: function ($event, item) {
                openScriptEditor($event, item);
            },
            name: function() { return $translate.instant('action.create') },
            details: function() { return $translate.instant('board.open-script-editor') },
            icon: "code"
        },
        {
            onAction: function ($event, item) {
                vm.grid.deleteItem($event, item);
            },
            name: function() { return $translate.instant('action.delete') },
            details: function() { return $translate.instant('board.delete') },
            icon: "delete"
        }
    ];

    var vm = this;

    vm.boardGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: deleteBoardTitle,
        deleteItemContentFunc: deleteBoardText,
        deleteItemsTitleFunc: deleteBoardsTitle,
        deleteItemsActionTitleFunc: deleteBoardsActionTitle,
        deleteItemsContentFunc: deleteBoardsText,

        fetchItemsFunc: fetchBoards,
        saveItemFunc: saveBoard,
        deleteItemFunc: deleteBoard,

        getItemTitleFunc: getBoardTitle,
        itemCardTemplateUrl: boardCard,
        parentCtl: vm,

        actionsList: boardActionsList,

        onGridInited: gridInited,

        noItemsText: function() { return $translate.instant('board.no-boards-text') },
        itemDetailsText: function() { return $translate.instant('board.board-details') },
        hideAddItemButton: function() { return true }
    };

    if (angular.isDefined($stateParams.items) && $stateParams.items !== null) {
        vm.boardGridConfig.items = $stateParams.items;
    }

    if (angular.isDefined($stateParams.topIndex) && $stateParams.topIndex > 0) {
        vm.boardGridConfig.topIndex = $stateParams.topIndex;
    }

    vm.openScriptEditor = openScriptEditor;

    function deleteBoardTitle(board) {
        return $translate.instant('board.delete-board-title', {boardName: board.name});
    }

    function deleteBoardText() {
        return $translate.instant('board.delete-board-text');
    }

    function deleteBoardsTitle(selectedCount) {
        return $translate.instant('board.delete-boards-title', {count: selectedCount}, 'messageformat');
    }

    function deleteBoardsActionTitle(selectedCount) {
        return $translate.instant('board.delete-boards-action-title', {count: selectedCount}, 'messageformat');
    }

    function deleteBoardsText() {
        return $translate.instant('board.delete-boards-text');
    }

    function gridInited(grid) {
        vm.grid = grid;
    }

    function fetchBoards(pageLink) {
        return boardService.getAllBoards(pageLink);
    }

    function saveBoard(board) {
        return boardService.saveBoard(board);
    }

    function deleteBoard(boardId) {
        return boardService.deleteBoard(boardId);
    }

    function getBoardTitle(board) {
        return board ? board.name : '';
    }

    function openScriptEditor($event, board) {
        if ($event) {
            $event.stopPropagation();
        }
        if (board.scriptId.id) {
            $state.go('home.scripts.script', {scriptId: board.scriptId.id});
        } else {
            $state.go('home.scripts.new');
        }
        
    }

}
