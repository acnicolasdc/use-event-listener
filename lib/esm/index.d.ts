import { useEffect } from "react";
declare type DataEffectParameters = {
    key: string;
    value: any;
};
declare type UseEffectParams = Parameters<typeof useEffect>;
declare type EffectCallback = UseEffectParams[0];
declare type EffectCallbackWithParameters = (data: DataEffectParameters) => void;
declare type DependencyList = string[];
declare type UseEffectReturn = ReturnType<typeof useEffect>;
declare const useEffectStorageListener: (callback: EffectCallback | EffectCallbackWithParameters, dependencies: DependencyList) => UseEffectReturn;
export declare const useLocalStorage: (key: string) => {
    state: any;
    setState: import("react").Dispatch<any>;
};
/**
 * @param key
 * @param arg
 */
export declare const setStorage: (key: string, arg: unknown) => void;
/**
 * @param key
 */
export declare const removeStorage: (key: string) => void;
/**
 * @param key
 * @returns
 */
export declare const getStorage: (key: string) => string | null;
/**
 * @param callEventKey
 */
export declare const clearStorage: (callEventKey?: string | undefined) => void;
export default useEffectStorageListener;
