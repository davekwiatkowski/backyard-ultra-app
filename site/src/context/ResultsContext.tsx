'use client';

import React, { FC, createContext, useCallback } from 'react';
import { IResultItem } from '../types/IResultItem';
import { SortDirection } from '../types/SortDirection';
import { usePersistState } from '../util/hooks/usePersistState';
import { StorageKeyConstants } from '../constants/StorageKeyConstants';
import cloneDeep from 'lodash.clonedeep';

interface IResultsContext<K extends keyof any> {
  // search
  searchText: string;
  setSearchText: (searchText: string) => void;
  clearSearchText: () => void;
  // filtering
  searchFilters: Partial<{ [key in K]: string[] }>;
  addSearchFilter: (key: K, value: string | string[] | null) => void;
  removeSearchFilter: (key: K) => void;
  removeSearchFilters: (keys: K[]) => void;
  clearSearchFilters: () => void;
  replaceSearchFilters: (
    additions: Partial<{ [key in keyof IResultItem]: string | string[] | null }>,
    removeKeys: K[],
  ) => void;
  // pagination
  page: number;
  setPage: (page: number) => void;
  // sorting
  sorts: Partial<{ [key in K]: { dir: SortDirection; priority: number } }>;
  sortBy: (key: K, dir?: SortDirection) => void;
  clearSorting: () => void;
}

const defaultResultsContext: IResultsContext<keyof IResultItem> = {
  // search
  searchText: '',
  setSearchText: () => {},
  clearSearchText: () => {},
  // filtering
  searchFilters: {},
  addSearchFilter: () => {},
  removeSearchFilter: () => {},
  removeSearchFilters: () => {},
  clearSearchFilters: () => {},
  replaceSearchFilters: () => {},
  // pagination
  page: 0,
  setPage: () => {},
  // sorting
  sorts: {},
  sortBy: () => {},
  clearSorting: () => {},
};

export const ResultsContext =
  createContext<IResultsContext<keyof IResultItem>>(defaultResultsContext);

export const ResultsContextProvider: FC<{ children: React.JSX.Element | React.JSX.Element[] }> = ({
  children,
}) => {
  const [page, setPage] = usePersistState(0, StorageKeyConstants.PAGE);
  const [searchText, setSearchText] = usePersistState('', StorageKeyConstants.SEARCH);
  const [searchFilters, setSearchFilters] = usePersistState<Partial<{ [key: string]: string[] }>>(
    {},
    StorageKeyConstants.FILTERS,
  );
  const [sorts, setSorts] = usePersistState<
    Partial<{ [key: string]: { dir: SortDirection; priority: number } }>
  >({}, StorageKeyConstants.SORTS);

  const replaceSearchFilters = useCallback(
    (
      additions: Partial<{ [key in keyof IResultItem]: string | string[] | null }>,
      removeKeys: (keyof IResultItem)[],
    ) => {
      const newSearchFilters = cloneDeep(searchFilters);
      for (let removeKey of removeKeys) {
        delete newSearchFilters[removeKey];
      }

      for (let keyStr in additions) {
        const addKey = keyStr as keyof IResultItem;
        const addValue = additions[addKey];

        if (!addValue) continue;

        const values = newSearchFilters[addKey] ?? [];
        const newValues = [...values];
        if (Array.isArray(addValue)) {
          for (let v of addValue) {
            if (values.includes(v)) {
              continue;
            }
            newValues.push(v);
          }
        } else {
          if (values.includes(addValue)) {
            return;
          }
          newValues.push(addValue);
        }

        if (newValues.length === values.length) {
          return;
        }
        newSearchFilters[addKey] = newValues;
      }
      setSearchFilters(newSearchFilters);
      setPage(0);
    },
    [searchFilters, setPage, setSearchFilters],
  );

  const addSearchFilter = useCallback(
    (key: keyof IResultItem, value: string | string[] | null) => {
      if (!value) {
        return;
      }

      const newSearchFilters = cloneDeep(searchFilters);
      const values = newSearchFilters[key] ?? [];

      const newValues = [...values];
      if (Array.isArray(value)) {
        for (let v of value) {
          if (values.includes(v)) {
            continue;
          }
          newValues.push(v);
        }
      } else {
        if (values.includes(value)) {
          return;
        }
        newValues.push(value);
      }
      if (newValues.length === values.length) {
        return;
      }
      newSearchFilters[key] = newValues;
      setSearchFilters(newSearchFilters);
      setPage(0);
    },
    [searchFilters, setPage, setSearchFilters],
  );

  const removeSearchFilter = useCallback(
    (key: keyof IResultItem) => {
      const newSearchFilters = cloneDeep(searchFilters);
      delete newSearchFilters[key];
      setSearchFilters(newSearchFilters);
      setPage(0);
    },
    [searchFilters, setPage, setSearchFilters],
  );

  const removeSearchFilters = useCallback(
    (keys: (keyof IResultItem)[]) => {
      const newSearchFilters = cloneDeep(searchFilters);
      for (let key of keys) {
        delete newSearchFilters[key];
      }
      setSearchFilters(newSearchFilters);
      setPage(0);
    },
    [searchFilters, setPage, setSearchFilters],
  );

  const clearSearchFilters = useCallback(() => {
    setSearchFilters({});
    setPage(0);
  }, [setPage, setSearchFilters]);

  const handleSort = useCallback(
    (key: keyof IResultItem, dir: SortDirection) => {
      const newSorts = { ...sorts };
      Object.keys(newSorts).forEach((key) => {
        ++(newSorts[key as keyof IResultItem] as any).priority;
      });
      newSorts[key] = {
        dir:
          dir ??
          (sorts[key]?.dir === undefined ? 'asc' : sorts[key]?.dir === 'asc' ? 'desc' : undefined),
        priority: 0,
      };
      if (newSorts[key]?.dir === undefined) {
        delete newSorts[key];
      }
      setSorts(newSorts);
    },
    [setSorts, sorts],
  );

  const clearSorting = useCallback(() => {
    setSorts({});
  }, [setSorts]);

  const clearSearchText = useCallback(() => {
    setSearchText('');
  }, [setSearchText]);

  const handleSearchTextChange = useCallback(
    (searchText: string) => {
      setSearchText(searchText);
      setPage(0);
    },
    [setPage, setSearchText],
  );

  return (
    <ResultsContext.Provider
      value={{
        searchText,
        searchFilters,
        page,
        sorts,
        clearSearchText,
        sortBy: handleSort,
        setPage,
        addSearchFilter,
        removeSearchFilter,
        removeSearchFilters,
        replaceSearchFilters,
        clearSearchFilters,
        setSearchText: handleSearchTextChange,
        clearSorting,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
