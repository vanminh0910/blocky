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

import UrlHandler from './url.handler';
import addLocaleVietnamese from './locale/locale.constant-vi';

/* eslint-disable import/no-unresolved, import/default */

import mdiIconSet from '../svg/mdi.svg';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function AppConfig($provide,
    $urlRouterProvider,
    $locationProvider,
    $mdIconProvider,
    $mdThemingProvider,
    $httpProvider,
    $translateProvider,
    storeProvider,
    locales) {

    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise(UrlHandler);
    storeProvider.setCaching(false);

    $translateProvider.useSanitizeValueStrategy('sce');
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useLocalStorage();
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useMissingTranslationHandler('customTranslationHandlerFactory');
    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

    addLocaleVietnamese(locales);
    //var $window = angular.injector(['ng']).get('$window');
    //var lang = $window.navigator.language || $window.navigator.userLanguage;
    // if (lang === 'vi') {
    //     $translateProvider.useSanitizeValueStrategy(null);
    //     $translateProvider.preferredLanguage('vi_VN');
    // }

    for (var langKey in locales) {
        var translationTable = locales[langKey];
        $translateProvider.translations(langKey, translationTable);
    }

    $httpProvider.interceptors.push('globalInterceptor');

    $provide.decorator("$exceptionHandler", ['$delegate', '$injector', function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);
        };
    }]);

    $mdIconProvider.iconSet('mdi', mdiIconSet);
}