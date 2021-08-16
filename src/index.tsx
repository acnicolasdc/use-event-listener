import { useEffect, useState } from "react";

type DataEffectParameters = { key: string; value: any };
type UseEffectParams = Parameters<typeof useEffect>;
type EffectCallback = UseEffectParams[0];
type EffectCallbackWithParameters = (data: DataEffectParameters) => void;
type DependencyList = string[];
type UseEffectReturn = ReturnType<typeof useEffect>;

const useEffectStorageListener = (
  callback: EffectCallback | EffectCallbackWithParameters,
  dependencies: DependencyList
): UseEffectReturn => {
  useEffect(() => {
    dependencies.forEach((key: string) => {
      window.addEventListener(key, storageWatcher);
    });
    return () => {
      dependencies.forEach((key: string) => {
        window.removeEventListener(key, storageWatcher);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const storageWatcher = (e: any) => {
    callback({ key: e.type, value: getStorage(e.type) });
  };
};

export const useLocalStorage = (key: string) => {
  const [state, setState] = useState<null | string>(null);

  useEffect(() => {
    setState(() => {
      const exValue = getStorage(key);
      return exValue;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state){ 
      setStorage(key, state);
    }else {
      removeStorage(key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const storageWatcher = (e: any) => {
    if (e.newValue) {
      setState((currState: any) => {
        return e.newValue !== state ? e.newValue : currState;
      });
    }
  };

  useEffect(() => {
    window.addEventListener(key, storageWatcher);
    return () => {
      window.removeEventListener(key, storageWatcher);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { state, setState };
};

/** EventDispatcher React
 * @param key
 * @returns dispatchEvent
 */
const eventDispatcher = (key: string) => {
  return window.dispatchEvent(
    new Event(key, { bubbles: true, cancelable: true })
  );
};

// Local storage methods
/**
 * @param key
 * @param arg
 */
export const setStorage = (key: string, arg: unknown) => {
  if (!key)
    throw new Error("The storage events should not be used with no key");
  if (!arg)
    throw new Error("The storage events should not be used with no arguments");
  const value = typeof arg === "string" ? arg : JSON.stringify(arg);
  localStorage.setItem(key, value);
  eventDispatcher(key);
};
/**
 * @param key
 */
export const removeStorage = (key: string) => {
  if (!key)
    throw new Error("The storage events should not be used with no key");
  localStorage.removeItem(key);
  eventDispatcher(key);
};
/**
 * @param key
 * @returns
 */
export const getStorage = (key: string): string | null => {
  if (!key)
    throw new Error("The storage events should not be used with no key");
  return localStorage.getItem(key);
};
/**
 * @param callEventKey
 */
export const clearStorage = (callEventKey?: string) => {
  localStorage.clear();
  if (callEventKey) eventDispatcher(callEventKey);
};

export default useEffectStorageListener;
