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

/*@ngInject*/
export default function ScriptController(scriptService, userService, $state, $stateParams, $filter, $translate) {

    var scriptActionsList = [
        {
            onAction: function ($event, item) {
                vm.grid.deleteItem($event, item);
            },
            name: function() { return $translate.instant('action.delete') },
            details: function() { return $translate.instant('script.delete') },
            icon: "delete"
        }
    ];

    var scriptAddItemActionsList = [
        {
            onAction: function ($event) {
                openScriptEditor($event);
            },
            name: function() { return $translate.instant('action.create') },
            details: function() { return $translate.instant('script.create-new-script') },
            icon: "insert_drive_file"
        }
    ];

    var vm = this;

    vm.scriptGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: deleteScriptTitle,
        deleteItemContentFunc: deleteScriptText,
        deleteItemsTitleFunc: deleteScriptsTitle,
        deleteItemsActionTitleFunc: deleteScriptsActionTitle,
        deleteItemsContentFunc: deleteScriptsText,

        fetchItemsFunc: fetchScripts,
        saveItemFunc: saveScript,
        clickItemFunc: openScriptEditor,
        deleteItemFunc: deleteScript,

        getItemTitleFunc: getScriptTitle,
        parentCtl: vm,

        actionsList: scriptActionsList,
        addItemActions: scriptAddItemActionsList,

        onGridInited: gridInited,

        addItemText: function() { return $translate.instant('script.add-script-text') },
        noItemsText: function() { return $translate.instant('script.no-scripts-text') },
        itemDetailsText: function() { return $translate.instant('script.script-details') },
    };

    if (angular.isDefined($stateParams.items) && $stateParams.items !== null) {
        vm.scriptGridConfig.items = $stateParams.items;
    }

    if (angular.isDefined($stateParams.topIndex) && $stateParams.topIndex > 0) {
        vm.scriptGridConfig.topIndex = $stateParams.topIndex;
    }

    function deleteScriptTitle(script) {
        return $translate.instant('script.delete-script-title', {scriptName: script.name});
    }

    function deleteScriptText() {
        return $translate.instant('script.delete-script-text');
    }

    function deleteScriptsTitle(selectedCount) {
        return $translate.instant('script.delete-scripts-title', {count: selectedCount}, 'messageformat');
    }

    function deleteScriptsActionTitle(selectedCount) {
        return $translate.instant('script.delete-scripts-action-title', {count: selectedCount}, 'messageformat');
    }

    function deleteScriptsText() {
        return $translate.instant('script.delete-scripts-text');
    }

    function gridInited(grid) {
        vm.grid = grid;
    }

    function fetchScripts(pageLink) {
        return scriptService.getAllScripts(pageLink);
    }

    function saveScript(script) {
        return scriptService.saveScript(script);
    }

    function deleteScript(scriptId) {
        return scriptService.deleteScript(scriptId);
    }

    function getScriptTitle(script) {
        return script ? script.name : '';
    }

    function openScriptEditor($event, script) {
        if ($event) {
            $event.stopPropagation();
        }
        if (script) {
            $state.go('home.scripts.script', {scriptId: script._id});
        } else {
            $state.go('home.scripts.new');
        }
        
    }

}
