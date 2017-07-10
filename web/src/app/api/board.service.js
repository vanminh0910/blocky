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
export default angular.module('blocky.api.board', [])
    .factory('boardService', BoardService).name;

/*@ngInject*/
function BoardService($http, $q, $rootScope, $filter, types, utils, userService) {

    var allBoards = undefined;

    $rootScope.boardServiceStateChangeStartHandle = $rootScope.$on('$stateChangeStart', function () {
        invalidateBoardsCache();
    });

    var service = {
        getAllBoards: getAllBoards,
        getBoard: getBoard,
        deleteBoard: deleteBoard,
        saveBoard: saveBoard,
    }

    return service;

    function invalidateBoardsCache() {
        allBoards = undefined;
    }

    function loadBoardsCache() {
        var deferred = $q.defer();

        if (!allBoards) {
            var user = userService.getCurrentUser();
            var userId = user._doc._id;
            var url = types.baseApiUrl + '/user/' + userId + '/boards';
            $http.get(url, null).then(function success(response) {
                allBoards = response.data;
                allBoards = $filter('orderBy')(allBoards, ['+name', '-createdAt']);
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getAllBoards(pageLink) {
        var deferred = $q.defer();

        loadBoardsCache().then(
            function success() {
                utils.filterSearchTextEntities(allBoards, 'name', pageLink, deferred);
            },
            function fail() {
                deferred.reject();
            }
        );
        return deferred.promise;
    }

    function getBoard(boardId) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/api/v1/board/' + boardId;
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function saveBoard(board) { // Rename only
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/api/v1/board/' + board._id + '/rename';
        board.new_name = board.name;
        $http.post(url, board).then(function success(response) {
            invalidateBoardsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteBoard(boardId) {
        var deferred = $q.defer();
        var url = types.baseApiUrl + '/api/v1/board/' + boardId;
        $http.delete(url).then(function success() {
            invalidateBoardsCache();
            deferred.resolve();
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

}
