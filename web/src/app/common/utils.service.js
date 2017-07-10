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
import blockyTypes from "./types.constant";

export default angular.module('blocky.utils', [blockyTypes])
    .factory('utils', Utils)
    .name;

/*@ngInject*/
function Utils() {

    var service = {
        parseException: parseException,
        filterSearchTextEntities: filterSearchTextEntities
    }

    return service;

    function parseException(exception, lineOffset) {
        var data = {};
        if (exception) {
            if (angular.isString(exception) || exception instanceof String) {
                data.message = exception;
            } else {
                if (exception.name) {
                    data.name = exception.name;
                } else {
                    data.name = 'UnknownError';
                }
                if (exception.message) {
                    data.message = exception.message;
                }
                if (exception.lineNumber) {
                    data.lineNumber = exception.lineNumber;
                    if (exception.columnNumber) {
                        data.columnNumber = exception.columnNumber;
                    }
                } else if (exception.stack) {
                    var lineInfoRegexp = /(.*<anonymous>):(\d*)(:)?(\d*)?/g;
                    var lineInfoGroups = lineInfoRegexp.exec(exception.stack);
                    if (lineInfoGroups != null && lineInfoGroups.length >= 3) {
                        if (angular.isUndefined(lineOffset)) {
                            lineOffset = -2;
                        }
                        data.lineNumber = Number(lineInfoGroups[2]) + lineOffset;
                        if (lineInfoGroups.length >= 5) {
                            data.columnNumber = lineInfoGroups[4];
                        }
                    }
                }
            }
        }
        return data;
    }

    function filterSearchTextEntities(entities, searchTextField, pageLink, deferred) {
        var response = {
            data: [],
            hasNext: false,
            nextPageLink: null
        };
        var limit = pageLink.limit;
        var textSearch = '';
        if (pageLink.textSearch) {
            textSearch = pageLink.textSearch.toLowerCase();
        }

        for (var i=0;i<entities.length;i++) {
            var entity = entities[i];
            var text = entity[searchTextField].toLowerCase();
            var createdTime = entity.createdTime;
            if (pageLink.textOffset && pageLink.textOffset.length > 0) {
                var comparison = text.localeCompare(pageLink.textOffset);
                if (comparison === 0
                    && createdTime < pageLink.createdTimeOffset) {
                    response.data.push(entity);
                    if (response.data.length === limit) {
                        break;
                    }
                } else if (comparison > 0 && text.startsWith(textSearch)) {
                    response.data.push(entity);
                    if (response.data.length === limit) {
                        break;
                    }
                }
            } else if (textSearch.length > 0) {
                if (text.startsWith(textSearch)) {
                    response.data.push(entity);
                    if (response.data.length === limit) {
                        break;
                    }
                }
            } else {
                response.data.push(entity);
                if (response.data.length === limit) {
                    break;
                }
            }
        }
        if (response.data.length === limit) {
            var lastEntity = response.data[limit-1];
            response.nextPageLink = {
                limit: pageLink.limit,
                textSearch: textSearch,
                idOffset: lastEntity.id.id,
                createdTimeOffset: lastEntity.createdTime,
                textOffset: lastEntity[searchTextField].toLowerCase()
            };
            response.hasNext = true;
        }
        deferred.resolve(response);
    }

}
