import { createContext } from 'react';
import { IResultItem } from '../types/IResultItem';

interface IResultsContext<K extends keyof any> {
  searchFilters: Partial<{ [key in K]: string[] }>;
  searchText: string;
  addSearchFilter: (key: K, value: string) => void;
  removeSearchFilter: (key: K) => void;
  clearSearchFilters: () => void;
  setSearchText: (searchText: string) => void;
  // pagination
  page: number;
  setPage: (page: number) => void;
}

export const defaultResultsContext: IResultsContext<keyof IResultItem> = {
  searchFilters: {},
  searchText: '',
  addSearchFilter: () => {},
  removeSearchFilter: () => {},
  clearSearchFilters: () => {},
  setSearchText: () => {},
  // pagination
  page: 0,
  setPage: () => {},
};

export const ResultsContext =
  createContext<IResultsContext<keyof IResultItem>>(defaultResultsContext);
