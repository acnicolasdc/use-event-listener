import { useEffect } from 'react';
var useStorageListener = function (callback, dependencies) {
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
var eventDispatcher = function (key) {
    return window.dispatchEvent(new Event(key, { "bubbles": true, "cancelable": true }));
};
export var setStorage = function (key, arg) {
    if (!key)
        throw new Error('The storage events should not be used with no key');
    if (!arg)
        throw new Error('The storage events should not be used with no arguments');
    localStorage.setItem(key, arg);
    eventDispatcher(key);
};
export var removeStorage = function (key) {
    if (!key)
        throw new Error('The storage events should not be used with no key');
    localStorage.removeItem(key);
    eventDispatcher(key);
};
export var getStorage = function (key) {
    if (!key)
        throw new Error('The storage events should not be used with no key');
    return localStorage.getItem(key);
};
export var clearStorage = function (callEventKey) {
    localStorage.clear();
    if (callEventKey)
        eventDispatcher(callEventKey);
};
export default useStorageListener;
