'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export const usePersistState = <T>(defaultValue: T, storageKey: string) => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const localStorageValue = localStorage.getItem(storageKey);
    if (storageKey in localStorage) {
      setValue(JSON.parse(localStorageValue as string) as T);
    }
  }, [storageKey]);

  const handleValueChange = useCallback(
    (value: T) => {
      setValue(value);
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    [storageKey],
  );

  return useMemo<[T, (value: T) => void]>(
    () => [value, handleValueChange],
    [handleValueChange, value],
  );
};
