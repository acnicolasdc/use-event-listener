import { useEffect, useState } from "react";

type DataEffectParameters = { key: string; value: any };
type UseEffectParams = Parameters<typeof useEffect>;
type EffectCallback = UseEffectParams[0];
type EffectCallbackWithParameters = (data: DataEffectParameters) => void;
type DependencyList = string[];
type UseEffectReturn = ReturnType<typeof useEffect>;

enum StoreTypes {
  primitive = "USL_PRIMITIVE",
  object = "USL_OBJECT",
  undefined = "USL_UNDEFINED",
}

const eventsNamespace = "useStorageListener_";

const keyBuilder = (key: string) => {
  return `${eventsNamespace}${key}`;
};

const useEffectStorageListener = (
  callback: EffectCallback | EffectCallbackWithParameters,
  dependencies: DependencyList
): UseEffectReturn => {
  useEffect(() => {
    dependencies.forEach((key: string) => {
      window.addEventListener(keyBuilder(key), storageWatcher);
    });
    return () => {
      dependencies.forEach((key: string) => {
        window.removeEventListener(keyBuilder(key), storageWatcher);
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
    if (state) {
      setStorage(key, state);
    } else {
      removeStorage(key);
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
    window.addEventListener(keyBuilder(key), storageWatcher);
    return () => {
      window.removeEventListener(keyBuilder(key), storageWatcher);
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
    new Event(keyBuilder(key), { bubbles: true, cancelable: true })
  );
};
/**
 * @param value
 * @returns
 */
const isPrimitive = (value: unknown): boolean => {
  return value == null || /^[sbn]/.test(typeof value);
};
/**
 * @param value
 * @returns
 */
const detectValueType = (value: unknown): StoreTypes => {
  if (Array.isArray(value) || typeof value === "object") {
    return StoreTypes.object;
  }
  if (isPrimitive(value)) {
    return StoreTypes.primitive;
  }
  return StoreTypes.undefined;
};
/**
 * @param type 
 * @param value 
 * @returns 
 */
const prefixBuilder = (type:StoreTypes, value: string ): string => {
  return `${value}?${eventsNamespace}type=${type}`;
} 
/**
 * @param value
 * @returns
 */
const parseValueToSetStorage = (value: unknown): string | null => {
  const type = detectValueType(value);
  if(type === StoreTypes.undefined) return null;
  return prefixBuilder(type, JSON.stringify(value))
};

const parseValueToGetStorage = (value: string) => {
  const nonParseData = value.split('?useStorageListener_type=');
  switch (nonParseData[1]) {
    case StoreTypes.object:  
      return JSON.parse(nonParseData[0])
    default:
      return nonParseData[0];
  } 
};
// Local storage methods
/**
 * @param key
 * @param arg
 */
export const setStorage = (key: string, arg: unknown) => {
  const value = parseValueToSetStorage(arg);
  if (!key)
    throw new Error("The storage events should not be used with no key");
  if (!value)
    throw new Error("The storage events should not be used with no arguments");
  //const value = typeof arg === "string" ? arg : JSON.stringify(arg);
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
  const value = localStorage.getItem(key)
  if(!value) return value;
  return parseValueToGetStorage(value);
};
/**
 * @param callEventKey
 */
export const clearStorage = (callEventKey?: string) => {
  localStorage.clear();
  if (callEventKey) eventDispatcher(callEventKey);
};

export default useEffectStorageListener;
