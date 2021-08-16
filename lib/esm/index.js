import { useEffect, useState } from "react";
var useEffectStorageListener = function (callback, dependencies) {
    useEffect(function () {
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
        callback({ key: e.type, value: getStorage(e.type) });
    };
};
export var useLocalStorage = function (key) {
    var _a = useState(null), state = _a[0], setState = _a[1];
    useEffect(function () {
        setState(function () {
            var exValue = getStorage(key);
            return exValue;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(function () {
        if (state) {
            setStorage(key, state);
        }
        else {
            removeStorage(key);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    var storageWatcher = function (e) {
        if (e.newValue) {
            setState(function (currState) {
                return e.newValue !== state ? e.newValue : currState;
            });
        }
    };
    useEffect(function () {
        window.addEventListener(key, storageWatcher);
        return function () {
            window.removeEventListener(key, storageWatcher);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    return { state: state, setState: setState };
};
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
export var setStorage = function (key, arg) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    if (!arg)
        throw new Error("The storage events should not be used with no arguments");
    var value = typeof arg === "string" ? arg : JSON.stringify(arg);
    localStorage.setItem(key, value);
    eventDispatcher(key);
};
/**
 * @param key
 */
export var removeStorage = function (key) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    localStorage.removeItem(key);
    eventDispatcher(key);
};
/**
 * @param key
 * @returns
 */
export var getStorage = function (key) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    return localStorage.getItem(key);
};
/**
 * @param callEventKey
 */
export var clearStorage = function (callEventKey) {
    localStorage.clear();
    if (callEventKey)
        eventDispatcher(callEventKey);
};
export default useEffectStorageListener;
