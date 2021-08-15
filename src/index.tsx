import { useEffect } from 'react';
type DataEffectParameters = { key: string, value: any};
type UseEffectParams = Parameters<typeof useEffect>
type EffectCallback = UseEffectParams[0];
type EffectCallbackWithParameters = (data:DataEffectParameters) => void
type DependencyList = string[];
type UseEffectReturn = ReturnType<typeof useEffect>


const useStorageListener = (callback: EffectCallback | EffectCallbackWithParameters ,
    dependencies: DependencyList,): UseEffectReturn => {
    useEffect(() => {
        dependencies.forEach((key: string) => {
            window.addEventListener(key, storageWatcher);
        })
        return () => {
            dependencies.forEach((key: string) => {
                window.removeEventListener(key, storageWatcher);
            })
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const storageWatcher = (e: any) => {
        callback({key: e.type, value: getStorage(e.type)})
    };
}

const eventDispatcher = (key: string) => {
    return window.dispatchEvent(new Event(key, { "bubbles": true, "cancelable": true }));
}

export const setStorage = (key: string, arg: string) => {
    if (!key) throw new Error(
        'The storage events should not be used with no key',
    )
    if (!arg) throw new Error(
        'The storage events should not be used with no arguments',
    );
    localStorage.setItem(key, arg)
    eventDispatcher(key);
}

export const removeStorage = (key: string) => {
    if (!key) throw new Error(
        'The storage events should not be used with no key',
    )
    localStorage.removeItem(key)
    eventDispatcher(key);
}

export const getStorage = (key: string) => {
    if (!key) throw new Error(
        'The storage events should not be used with no key',
    )
    return localStorage.getItem(key)
}

export const clearStorage = (callEventKey?: string) => {
    localStorage.clear();
    if(callEventKey)eventDispatcher(callEventKey);
}

export default useStorageListener