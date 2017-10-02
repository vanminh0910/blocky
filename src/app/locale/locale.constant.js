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

export default angular.module('blocky.locale', [])
    .constant('locales',
        {
            'en_US': {
                "language": {
                    "language": "Language",
                    "en_US": "English",
                    "vi_VN": "Tiếng Việt"
                },
                "home": {
                    "profile": "Profile",
                    "logout": "Logout",
                    "codelab": "Code Lab",
                    "dashboard": "Dashboard"
                },
                "access": {
                    "unauthorized": "Unauthorized",
                    "unauthorized-access": "Unauthorized Access",
                    "unauthorized-access-text": "You should sign in to have access to this resource!",
                    "access-forbidden": "Access Forbidden",
                    "access-forbidden-text": "You haven't access rights to this location!<br/>Try to sign in with different user if you still wish to gain access to this location.",
                    "refresh-token-expired": "Session has expired",
                    "refresh-token-failed": "Unable to refresh session"
                },
                "action": {
                    "activate": "Activate",
                    "suspend": "Suspend",
                    "save": "Save",
                    "saveAs": "Save as",
                    "cancel": "Cancel",
                    "ok": "OK",
                    "delete": "Delete",
                    "add": "Add",
                    "yes": "Yes",
                    "no": "No",
                    "update": "Update",
                    "remove": "Remove",
                    "search": "Search",
                    "assign": "Assign",
                    "unassign": "Unassign",
                    "share": "Share",
                    "unshare": "Unshare",
                    "apply": "Apply",
                    "apply-changes": "Apply changes",
                    "edit-mode": "Edit mode",
                    "enter-edit-mode": "Enter edit mode",
                    "decline-changes": "Decline changes",
                    "close": "Close",
                    "back": "Back",
                    "run": "Run",
                    "sign-in": "Sign in!",
                    "edit": "Edit",
                    "view": "View",
                    "create": "Create",
                    "drag": "Drag",
                    "refresh": "Refresh",
                    "undo": "Undo",
                    "copy": "Copy",
                    "paste": "Paste",
                    "import": "Import",
                    "export": "Export",
                    "upload": "Upload",
                    "open": "Open",
                    "rename": "Rename"
                },
                "aggregation": {
                    "aggregation": "Aggregation",
                    "function": "Data aggregation function",
                    "limit": "Max values",
                    "group-interval": "Grouping interval",
                    "min": "Min",
                    "max": "Max",
                    "avg": "Average",
                    "sum": "Sum",
                    "count": "Count",
                    "none": "None"
                },
                "attribute": {
                    "attributes": "Attributes",
                    "latest-telemetry": "Latest telemetry",
                    "attributes-scope": "Device attributes scope",
                    "scope-latest-telemetry": "Latest telemetry",
                    "scope-client": "Client attributes",
                    "scope-server": "Server attributes",
                    "scope-shared": "Shared attributes",
                    "add": "Add attribute",
                    "key": "Key",
                    "key-required": "Attribute key is required.",
                    "value": "Value",
                    "value-required": "Attribute value is required.",
                    "delete-attributes-title": "Are you sure you want to delete { count, select, 1 {1 attribute} other {# attributes} }?",
                    "delete-attributes-text": "Be careful, after the confirmation all selected attributes will be removed.",
                    "delete-attributes": "Delete attributes",
                    "enter-attribute-value": "Enter attribute value",
                    "show-on-widget": "Show on widget",
                    "widget-mode": "Widget mode",
                    "next-widget": "Next widget",
                    "prev-widget": "Previous widget",
                    "add-to-dashboard": "Add to dashboard",
                    "add-widget-to-dashboard": "Add widget to dashboard",
                    "selected-attributes": "{ count, select, 1 {1 attribute} other {# attributes} } selected",
                    "selected-telemetry": "{ count, select, 1 {1 telemetry unit} other {# telemetry units} } selected"
                },
                "confirm-on-exit": {
                    "message": "You have unsaved changes. Are you sure you want to leave this page?",
                    "html-message": "You have unsaved changes.<br/>Are you sure you want to leave this page?",
                    "title": "Unsaved changes"
                },
                "contact": {
                    "country": "Country",
                    "city": "City",
                    "state": "State",
                    "postal-code": "Postal code",
                    "postal-code-invalid": "Only digits are allowed.",
                    "address": "Address",
                    "address2": "Address 2",
                    "phone": "Phone",
                    "email": "Email",
                    "no-address": "No address"
                },
                "common": {
                    "username": "Username",
                    "password": "Password",
                    "enter-username": "Enter username",
                    "enter-password": "Enter password",
                    "enter-search": "Enter search"
                },
                "datetime": {
                    "date-from": "Date from",
                    "time-from": "Time from",
                    "date-to": "Date to",
                    "time-to": "Time to"
                },
                "datakey": {
                    "settings": "Settings",
                    "advanced": "Advanced",
                    "label": "Label",
                    "color": "Color",
                    "data-generation-func": "Data generation function",
                    "use-data-post-processing-func": "Use data post-processing function",
                    "configuration": "Data key configuration",
                    "timeseries": "Timeseries",
                    "attributes": "Attributes",
                    "timeseries-required": "Device timeseries is required.",
                    "timeseries-or-attributes-required": "Device timeseries/attributes is required.",
                    "function-types": "Function types",
                    "function-types-required": "Function types is required."
                },
                "datasource": {
                    "type": "Datasource type",
                    "add-datasource-prompt": "Please add datasource"
                },
                "details": {
                    "edit-mode": "Edit mode",
                    "toggle-edit-mode": "Toggle edit mode"
                },
                "dialog": {
                    "close": "Close dialog"
                },
                "error": {
                    "unable-to-connect": "Unable to connect to the server! Please check your internet connection.",
                    "unhandled-error-code": "Unhandled error code: {{errorCode}}",
                    "unknown-error": "Unknown error"
                },
                "event": {
                    "event-type": "Event type",
                    "type-alarm": "Alarm",
                    "type-error": "Error",
                    "type-lc-event": "Lifecycle event",
                    "type-stats": "Statistics",
                    "no-events-prompt": "No events found",
                    "error": "Error",
                    "alarm": "Alarm",
                    "event-time": "Event time",
                    "server": "Server",
                    "body": "Body",
                    "method": "Method",
                    "event": "Event",
                    "status": "Status",
                    "success": "Success",
                    "failed": "Failed",
                    "messages-processed": "Messages processed",
                    "errors-occurred": "Errors occurred"
                },
                "fullscreen": {
                    "expand": "Expand to fullscreen",
                    "exit": "Exit fullscreen",
                    "toggle": "Toggle fullscreen mode",
                    "fullscreen": "Fullscreen"
                },
                "function": {
                    "function": "Function"
                },
                "grid": {
                    "delete-item-title": "Are you sure you want to delete this item?",
                    "delete-item-text": "Be careful, after the confirmation this item and all related data will become unrecoverable.",
                    "delete-items-title": "Are you sure you want to delete { count, select, 1 {1 item} other {# items} }?",
                    "delete-items-action-title": "Delete { count, select, 1 {1 item} other {# items} }",
                    "delete-items-text": "Be careful, after the confirmation all selected items will be removed and all related data will become unrecoverable.",
                    "add-item-text": "Add new item",
                    "no-items-text": "No items found",
                    "item-details": "Item details",
                    "delete-item": "Delete Item",
                    "delete-items": "Delete Items",
                    "scroll-to-top": "Scroll to top"
                },
                "help": {
                    "goto-help-page": "Go to help page"
                },
                "import": {
                    "no-file": "No file selected",
                    "drop-file": "Drop a JSON file or click to select a file to upload."
                },
                "item": {
                    "selected": "Selected"
                },
                "js-func": {
                    "no-return-error": "Function must return value!",
                    "return-type-mismatch": "Function must return value of '{{type}}' type!"
                },
                "legend": {
                    "position": "Legend position",
                    "show-max": "Show max value",
                    "show-min": "Show min value",
                    "show-avg": "Show average value",
                    "show-total": "Show total value",
                    "settings": "Legend settings",
                    "min": "min",
                    "max": "max",
                    "avg": "avg",
                    "total": "total"
                },
                "login": {
                    "login": "Login",
                    "request-password-reset": "Request Password Reset",
                    "reset-password": "Reset Password",
                    "create-password": "Create Password",
                    "passwords-mismatch-error": "Entered passwords must be same!",
                    "password-again": "Password again",
                    "sign-in-title": "Log in to see Blocky in action.",
                    "username": "Username (email)",
                    "remember-me": "Remember me",
                    "forgot-password": "Forgot Password?",
                    "password-reset": "Password reset",
                    "new-password": "New password",
                    "new-password-again": "New password again",
                    "password-link-sent-message": "Password reset link was successfully sent!",
                    "email": "Email",
                    "do-not-have-account": "Do not have an account?",
                    "create-account": "Create an account",
                    "sign-up-title": "Create your personal account on the Blocky cloud. It is totally free!",
                    "sign-up": "Sign up",
                    "first-name": "First name",
                    "last-name": "Last name",
                    "already-have-account": "Already have an account?"
                },
                "device": {
                    "device": "Device",
                    "devices": "Devices",
                    "open-script-editor": "Open script editor",
                    "delete": "Delete device",
                    "online": "Online",
                    "offline": "Offline",
                    "name": "Name",
                    "name-required": "Name is required.",
                    "description": "Description",
                    "delete-device-title": "Are you sure you want to delete the device '{{deviceName}}'?",
                    "delete-device-text": "Be careful, after the confirmation the device and all related data will become unrecoverable.",
                    "no-boards-text": "No boards found",
                    "device-details": "Device details",
                    "details": "Details",
                    "register-new-device": "Register new device"
                },
                "script": {
                    "scripts": "Scripts",
                    "delete": "Delete script",
                    "name": "Name",
                    "name-required": "Name is required.",
                    "description": "Description",
                    "add": "Add Script",
                    "delete-script-title": "Are you sure you want to delete the script '{{scriptName}}'?",
                    "delete-script-text": "Be careful, after the confirmation the script and all related data will become unrecoverable.",
                    "delete-scripts-title": "Are you sure you want to delete { count, select, 1 {1 script} other {# scripts} }?",
                    "delete-scripts-action-title": "Delete { count, select, 1 {1 script} other {# scripts} }",
                    "delete-scripts-text": "Be careful, after the confirmation all selected scripts will be removed and all related data will become unrecoverable.",
                    "add-script-text": "Add new script",
                    "no-scripts-text": "No scripts found",
                    "script-details": "Script details",
                    
                    "select-script": "Select script",
                    "script": "Script",
                    "new": "New Script",
                    "no-scripts-matching": "No scripts matching '{{script}}' were found.",
                    "script-required": "Script is required.",
                    "script-require-match": "Please select an existing script.",
                    "details": "Details",
                    "create-new-script": "Create new script",
                    "script-load-failed-error": "Failed to load script",
                    "script-upload-failed-error": "Failed to upload script to device",
                    "script-upload-success": "Script has been uploaded to device",
                    "please-save-new-script": "Please save the new script before uploading",
                    "please-select-device": "Please select a device",
                    "open-toolbar": "Open script editor toolbar",
                    "close-toolbar": "Close toolbar",
                    "upload-to-device": "Upload to device",
                    "open-existing-script": "Open existing script",
                    "edit-blockly": "Edit Blockly",
                    "edit-lua": "Edit Lua",
                    "script-save-failed-error": "Failed to save script",
                    "confirm-convert-title": "Oops, there is a problem converting your code.",
                    "confirm-convert-content": "We are unable to convert your Lua code back to blocks. You can keep working in Lua or discard your changes and go back to the previous Blocks version.",
                    "confirm-convert-ok": "Discard and go to Blocks",
                    "confirm-convert-cancel": "Stay in Lua",
                },
                "project": {
                    "delete-project-title": "Are you sure you want to delete the project '{{projectName}}'?",
                    "delete-project-text": "Be careful, after the confirmation the project and all related data will become unrecoverable."
                },
                "dashboard": {
                    "dashboards": "Dashboards",
                    "delete": "Delete dashboard",
                    "name": "Name",
                    "name-required": "Name is required.",
                    "dedashboardion": "Dedashboardion",
                    "add": "Add Dashboard",
                    "delete-dashboard-title": "Are you sure you want to delete the dashboard '{{dashboardName}}'?",
                    "delete-dashboard-text": "Be careful, after the confirmation the dashboard and all related data will become unrecoverable.",
                    "delete-dashboards-title": "Are you sure you want to delete { count, select, 1 {1 dashboard} other {# dashboards} }?",
                    "delete-dashboards-action-title": "Delete { count, select, 1 {1 dashboard} other {# dashboards} }",
                    "delete-dashboards-text": "Be careful, after the confirmation all selected dashboards will be removed and all related data will become unrecoverable.",
                    "add-dashboard-text": "Add new dashboard",
                    "no-dashboards-text": "No dashboards found",
                    "dashboard-details": "Dashboard details",
                    
                    "select-dashboard": "Select dashboard",
                    "dashboard": "Dashboard",
                    "new": "New Dashboard",
                    "no-dashboards-matching": "No dashboards matching '{{dashboard}}' were found.",
                    "dashboard-required": "Dashboard is required.",
                    "dashboard-require-match": "Please select an existing dashboard.",
                    "details": "Details",
                    "create-new-dashboard": "Create new dashboard",
                    "dashboard-load-failed-error": "Failed to load dashboard",
                    "open-existing-dashboard": "Open existing dashboard",
                    "dashboard-save-failed-error": "Failed to save dashboard",
                    "send-message-failed-error": "Failed to send message to device",
                },
                "position": {
                    "top": "Top",
                    "bottom": "Bottom",
                    "left": "Left",
                    "right": "Right"
                },
                "profile": {
                    "profile": "Profile",
                    "change-password": "Change Password",
                    "current-password": "Current password"
                },
                "timeinterval": {
                    "seconds-interval": "{ seconds, select, 1 {1 second} other {# seconds} }",
                    "minutes-interval": "{ minutes, select, 1 {1 minute} other {# minutes} }",
                    "hours-interval": "{ hours, select, 1 {1 hour} other {# hours} }",
                    "days-interval": "{ days, select, 1 {1 day} other {# days} }",
                    "days": "Days",
                    "hours": "Hours",
                    "minutes": "Minutes",
                    "seconds": "Seconds",
                    "advanced": "Advanced"
                },
                "timewindow": {
                    "days": "{ days, select, 1 { day } other {# days } }",
                    "hours": "{ hours, select, 0 { hour } 1 {1 hour } other {# hours } }",
                    "minutes": "{ minutes, select, 0 { minute } 1 {1 minute } other {# minutes } }",
                    "seconds": "{ seconds, select, 0 { second } 1 {1 second } other {# seconds } }",
                    "realtime": "Realtime",
                    "history": "History",
                    "last-prefix": "last",
                    "period": "from {{ startTime }} to {{ endTime }}",
                    "edit": "Edit timewindow",
                    "date-range": "Date range",
                    "last": "Last",
                    "time-period": "Time period"
                },
                "user": {
                    "users": "Users",
                    "customer-users": "Customer Users",
                    "tenant-admins": "Tenant Admins",
                    "sys-admin": "System administrator",
                    "tenant-admin": "Tenant administrator",
                    "customer": "Customer",
                    "anonymous": "Anonymous",
                    "add": "Add User",
                    "delete": "Delete user",
                    "add-user-text": "Add new user",
                    "no-users-text": "No users found",
                    "user-details": "User details",
                    "delete-user-title": "Are you sure you want to delete the user '{{userEmail}}'?",
                    "delete-user-text": "Be careful, after the confirmation the user and all related data will become unrecoverable.",
                    "delete-users-title": "Are you sure you want to delete { count, select, 1 {1 user} other {# users} }?",
                    "delete-users-action-title": "Delete { count, select, 1 {1 user} other {# users} }",
                    "delete-users-text": "Be careful, after the confirmation all selected users will be removed and all related data will become unrecoverable.",
                    "activation-email-sent-message": "Activation email was successfully sent!",
                    "resend-activation": "Resend activation",
                    "email": "Email",
                    "email-required": "Email is required.",
                    "first-name": "First Name",
                    "last-name": "Last Name",
                    "name": "Name",
                    "description": "Description",
                    "default-dashboard": "Default dashboard",
                    "always-fullscreen": "Always fullscreen"
                },
                "value": {
                    "type": "Value type",
                    "string": "String",
                    "string-value": "String value",
                    "integer": "Integer",
                    "integer-value": "Integer value",
                    "invalid-integer-value": "Invalid integer value",
                    "double": "Double",
                    "double-value": "Double value",
                    "boolean": "Boolean",
                    "boolean-value": "Boolean value",
                    "false": "False",
                    "true": "True"
                }
            },
        }
    ).name;