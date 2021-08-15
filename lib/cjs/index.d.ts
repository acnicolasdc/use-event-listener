import { useEffect } from 'react';
declare type DataEffectParameters = {
    key: string;
    value: any;
};
declare type UseEffectParams = Parameters<typeof useEffect>;
declare type EffectCallback = UseEffectParams[0];
declare type EffectCallbackWithParameters = (data: DataEffectParameters) => void;
declare type DependencyList = string[];
declare type UseEffectReturn = ReturnType<typeof useEffect>;
declare const useStorageListener: (callback: EffectCallback | EffectCallbackWithParameters, dependencies: DependencyList) => UseEffectReturn;
export declare const setStorage: (key: string, arg: string) => void;
export declare const removeStorage: (key: string) => void;
export declare const getStorage: (key: string) => string | null;
export default useStorageListener;
