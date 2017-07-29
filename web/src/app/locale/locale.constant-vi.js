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

export default function addLocaleVietnamese(locales) {
    var vi_VN = {
        "common": {
            "username": "Tên tài khoản",
            "password": "Mật khẩu",
            "enter-username": "Nhập tên tài khoản",
            "enter-password": "Nhập mật khẩu",
            "enter-search": "Nhập tìm kiếm"
        },
        "login": {
            "login": "Đăng nhập",
            "create-password": "Tạo mật khẩu",
            "passwords-mismatch-error": "Mật khẩu nhập lại chưa chính xác!",
            "password-again": "Nhập lại mật khẩu",
            "sign-in-title": "Chào mừng đến với EasyTech",
            "username": "Tên tài khoản (email)",
            "forgot-password": "Quên mật khẩu?",
            "email": "Email",
            "do-not-have-account": "Bạn chưa có tài khoản?",
            "create-account": "Tạo tài khoản",
            "sign-up-title": "Tạo tài khoản trên EasyTech cloud. Hoàn toàn miễn phí!",
            "sign-up": "Đăng ký",
            "first-name": "Tên",
            "last-name": "Họ",
            "already-have-account": "Bạn đã có tài khoản?"
        },
        "language": {
            "language": "Ngôn ngữ",
            "en_US": "Tiếng Anh",
            "vi_VN": "Tiếng Việt"
        }
    };
    angular.extend(locales, { 'vi_VN': vi_VN });
}