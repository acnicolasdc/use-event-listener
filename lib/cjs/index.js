"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearStorage = exports.getStorage = exports.removeStorage = exports.setStorage = void 0;
var react_1 = require("react");
var useStorageListener = function (callback, dependencies) {
    react_1.useEffect(function () {
        dependencies.forEach(function (key) {
            window.addEventListener(key, storageWatcher);
        });
        return function () {
            dependencies.forEach(function (key) {
                window.removeEventListener(key, storageWatcher);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var storageWatcher = function (e) {
        callback({ key: e.type, value: exports.getStorage(e.type) });
    };
};
var eventDispatcher = function (key) {
    return window.dispatchEvent(new Event(key, { "bubbles": true, "cancelable": true }));
};
var setStorage = function (key, arg) {
    if (!key)
        throw new Error('The storage events should not be used with no key');
    if (!arg)
        throw new Error('The storage events should not be used with no arguments');
    localStorage.setItem(key, arg);
    eventDispatcher(key);
};
exports.setStorage = setStorage;
var removeStorage = function (key) {
    if (!key)
        throw new Error('The storage events should not be used with no key');
    localStorage.removeItem(key);
    eventDispatcher(key);
};
exports.removeStorage = removeStorage;
var getStorage = function (key) {
    if (!key)
        throw new Error('The storage events should not be used with no key');
    return localStorage.getItem(key);
};
exports.getStorage = getStorage;
var clearStorage = function (callEventKey) {
    localStorage.clear();
    if (callEventKey)
        eventDispatcher(callEventKey);
};
exports.clearStorage = clearStorage;
exports.default = useStorageListener;
