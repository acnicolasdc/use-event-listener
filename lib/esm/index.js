import { useEffect, useState } from "react";
var StoreTypes;
(function (StoreTypes) {
    StoreTypes["primitive"] = "usl_primitive";
    StoreTypes["object"] = "usl_object";
    StoreTypes["undefined"] = "usl_undefined";
})(StoreTypes || (StoreTypes = {}));
var eventsNamespace = "useStorageListener_";
var keyBuilder = function (key) {
    return "" + eventsNamespace + key;
};
var removeKeyBuilder = function (key) {
    return key.replace(eventsNamespace, "");
};
var useEffectStorageListener = function (callback, dependencies) {
    useEffect(function () {
        dependencies.forEach(function (key) {
            window.addEventListener(keyBuilder(key), storageWatcher);
        });
        return function () {
            dependencies.forEach(function (key) {
                window.removeEventListener(keyBuilder(key), storageWatcher);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var storageWatcher = function (e) {
        callback({ key: removeKeyBuilder(e.type), value: getStorage(e.type) });
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
        window.addEventListener(keyBuilder(key), storageWatcher);
        return function () {
            window.removeEventListener(keyBuilder(key), storageWatcher);
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
    return window.dispatchEvent(new Event(keyBuilder(key), { bubbles: true, cancelable: true }));
};
/**
 * @param value
 * @returns
 */
var isPrimitive = function (value) {
    return value == null || /^[sbn]/.test(typeof value);
};
/**
 * @param value
 * @returns
 */
var detectValueType = function (value) {
    if (!value)
        return StoreTypes.undefined;
    if (isPrimitive(value)) {
        return StoreTypes.primitive;
    }
    if (Array.isArray(value) || typeof value === "object") {
        return StoreTypes.object;
    }
    return StoreTypes.undefined;
};
/**
 * @param type
 * @param value
 * @returns
 */
var prefixBuilder = function (type, value) {
    return value + "?" + eventsNamespace + "type=" + type;
};
/**
 * @param value
 * @returns
 */
var parseValueToSetStorage = function (value) {
    var type = detectValueType(value);
    if (type === StoreTypes.undefined)
        return null;
    var parseValue = type === StoreTypes.object ? JSON.stringify(value) : value;
    return prefixBuilder(type, parseValue);
};
var parseValueToGetStorage = function (value) {
    var nonParseData = value.split("?useStorageListener_type=");
    switch (nonParseData[1]) {
        case StoreTypes.object:
            return JSON.parse(nonParseData[0]);
        default:
            return nonParseData[0];
    }
};
// Local storage methods
/**
 * @param key
 * @param arg
 */
export var setStorage = function (key, arg) {
    var value = parseValueToSetStorage(arg);
    if (!key)
        throw new Error("The storage events should not be used with no key");
    if (!value)
        throw new Error("The storage events should not be used with null, undefined or no arguments ");
    localStorage.setItem(removeKeyBuilder(key), value);
    eventDispatcher(key);
};
/**
 * @param key
 */
export var removeStorage = function (key) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    localStorage.removeItem(removeKeyBuilder(key));
    eventDispatcher(key);
};
/**
 * @param key
 * @returns
 */
export var getStorage = function (key) {
    if (!key)
        throw new Error("The storage events should not be used with no key");
    var value = localStorage.getItem(removeKeyBuilder(key));
    if (!value)
        return value;
    return parseValueToGetStorage(value);
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
