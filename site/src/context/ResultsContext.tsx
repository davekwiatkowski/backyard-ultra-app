'use client';

import React, { FC, createContext, useCallback } from 'react';
import { IResultItem } from '../types/IResultItem';
import { useQueryState, parseAsString, parseAsJson, parseAsInteger } from 'nuqs';
import { SortDirection } from '../types/SortDirection';

interface IResultsContext<K extends keyof any> {
  // search
  searchText: string;
  setSearchText: (searchText: string) => void;
  clearSearchText: () => void;
  // filtering
  searchFilters: Partial<{ [key in K]: string[] }>;
  addSearchFilter: (key: K, value: string) => void;
  removeSearchFilter: (key: K) => void;
  clearSearchFilters: () => void;
  // pagination
  page: number;
  setPage: (page: number) => void;
  // sorting
  sorts: Partial<{ [key in K]: { dir: SortDirection; priority: number } }>;
  sortBy: (key: K) => void;
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
  clearSearchFilters: () => {},
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
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [searchText, setSearchText] = useQueryState('search', parseAsString.withDefault(''));
  const [searchFilters, setSearchFilters] = useQueryState(
    'filter',
    parseAsJson<Partial<{ [key: string]: string[] }>>().withDefault({}),
  );
  const [sorts, setSorts] = useQueryState(
    'sorts',
    parseAsJson<Partial<{ [key: string]: { dir: SortDirection; priority: number } }>>().withDefault(
      {},
    ),
  );

  const addSearchFilter = useCallback(
    (key: keyof IResultItem, value: string) => {
      const values = searchFilters[key] ?? [];
      if (values.includes(value)) {
        return;
      }
      const newValues = [...values, value];
      setSearchFilters({ ...searchFilters, [key]: newValues });
      setPage(0);
    },
    [searchFilters, setPage, setSearchFilters],
  );

  const removeSearchFilter = useCallback(
    (key: keyof IResultItem) => {
      const newSearchFilters = { ...searchFilters };
      delete newSearchFilters[key];
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
    (key: keyof IResultItem) => {
      const newSorts = { ...sorts };
      Object.keys(newSorts).forEach((key) => {
        ++(newSorts[key as keyof IResultItem] as any).priority;
      });
      newSorts[key] = {
        dir: sorts[key]?.dir === undefined ? 'asc' : sorts[key]?.dir === 'asc' ? 'desc' : undefined,
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
        clearSearchFilters,
        setSearchText,
        clearSorting,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
