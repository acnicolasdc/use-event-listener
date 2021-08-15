"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearStorage = exports.getStorage = exports.removeStorage = exports.setStorage = exports.useLocalStorage = void 0;
var react_1 = require("react");
var useEffectStorageListener = function (callback, dependencies) {
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
var useLocalStorage = function (key) {
    var _a = react_1.useState(null), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        setState(function () {
            var exValue = exports.getStorage(key);
            return exValue;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react_1.useEffect(function () {
        if (state)
            exports.setStorage(key, state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    var storageWatcher = function (e) {
        if (e.newValue) {
            setState(function (currState) {
                return e.newValue !== state ? e.newValue : currState;
            });
        }
    };
    react_1.useEffect(function () {
        window.addEventListener(key, storageWatcher);
        return function () {
            window.removeEventListener(key, storageWatcher);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    return { state: state, setState: setState };
};
exports.useLocalStorage = useLocalStorage;
/** EventDispatcher React
 * @param key
 * @returns dispatchEvent
 */
var eventDispatcher = function (key) {
    return window.dispatchEvent(new Event(key, { bubbles: true, cancelable: true }));
};
// Local storage methods
/**
 * @param key
 * @param arg
 */
var setStorage = function (key, arg) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    if (!arg)
        throw new Error("The storage events should not be used with no arguments");
    var value = typeof arg === "string" ? arg : JSON.stringify(arg);
    localStorage.setItem(key, value);
    eventDispatcher(key);
};
exports.setStorage = setStorage;
/**
 * @param key
 */
var removeStorage = function (key) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    localStorage.removeItem(key);
    eventDispatcher(key);
};
exports.removeStorage = removeStorage;
/**
 * @param key
 * @returns
 */
var getStorage = function (key) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    return localStorage.getItem(key);
};
exports.getStorage = getStorage;
/**
 * @param callEventKey
 */
var clearStorage = function (callEventKey) {
    localStorage.clear();
    if (callEventKey)
        eventDispatcher(callEventKey);
};
exports.clearStorage = clearStorage;
exports.default = useEffectStorageListener;
