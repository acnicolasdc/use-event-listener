import { useEffect, useState } from "react";

type DataEffectParameters = { key: string; value: any };
type UseEffectParams = Parameters<typeof useEffect>;
type EffectCallback = UseEffectParams[0];
type EffectCallbackWithParameters = (data: DataEffectParameters) => void;
type DependencyList = string[];
type UseEffectReturn = ReturnType<typeof useEffect>;

enum StoreTypes {
  primitive = "usl_primitive",
  object = "usl_object",
  undefined = "usl_undefined",
}

const eventsNamespace = "useStorageListener_";

const keyBuilder = (key: string) => {
  return `${eventsNamespace}${key}`;
};

const removeKeyBuilder = (key: string) => {
  return key.replace(eventsNamespace, "");
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
    callback({ key: removeKeyBuilder(e.type), value: getStorage(e.type) });
  };
};

export const useLocalStorage = (key: string) => {
  const [state, setState] = useState<null | any>(null);

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
  if (!value) return StoreTypes.undefined;
  if (isPrimitive(value)) {
    return StoreTypes.primitive;
  }
  if (Array.isArray(value) || typeof value === "object") {
    return StoreTypes.object;
  }
  return StoreTypes.undefined;
};
/**
 * @param value
 * @returns
 */
const parseValueToSetStorage = (value: unknown): string | null => {
  const type = detectValueType(value);
  if (type === StoreTypes.undefined) return null;
  const parseValue =
    type === StoreTypes.object ? JSON.stringify(value) : (value as string);
  return parseValue;
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
    throw new Error(
      "The storage events should not be used with null, undefined or no arguments "
    );
  localStorage.setItem(removeKeyBuilder(key), value);
  eventDispatcher(key);
};
/**
 * @param key
 */
export const removeStorage = (key: string) => {
  if (!key)
    throw new Error("The storage events should not be used with no key");
  localStorage.removeItem(removeKeyBuilder(key));
  eventDispatcher(key);
};
/**
 * @param key
 * @returns
 */
export const getStorage = (key: string): string | null => {
  if (!key)
    throw new Error("The storage events should not be used with no key");
  const value = localStorage.getItem(removeKeyBuilder(key));
  if (!value) return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value as any;
  }
};
/**
 * @param callEventKey
 */
export const clearStorage = (callEventKey?: string) => {
  localStorage.clear();
  if (callEventKey) eventDispatcher(callEventKey);
};

export default useEffectStorageListener;
