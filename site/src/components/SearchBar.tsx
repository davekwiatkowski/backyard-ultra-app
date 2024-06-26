'use client';

import { ChangeEventHandler, FC, useCallback, useContext } from 'react';
import { ResultsContext } from '../context/ResultsContext';
import { IResultItem } from '../types/IResultItem';

export const SearchBar: FC = () => {
  const {
    searchText,
    setSearchText,
    searchFilters,
    removeSearchFilter,
    clearSearchFilters,
    clearSearchText,
  } = useContext(ResultsContext);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setSearchText(e.currentTarget.value);
    },
    [setSearchText],
  );

  return (
    <div className="p-4">
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          name="search"
          type="text"
          className="grow"
          placeholder="Search"
          onChange={handleSearch}
          value={searchText}
        />
        {searchText && (
          <button
            className="btn btn-circle btn-outline btn-sm"
            disabled={!searchText}
            onClick={() => clearSearchText()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </label>
      <div className="label justify-start gap-1 pt-4 flex-wrap">
        {Object.entries(searchFilters).map(([key, value]) => (
          <button
            key={key + '-' + value}
            className="btn btn-xs"
            onClick={() => removeSearchFilter(key as keyof IResultItem)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="truncate">
              {key}={value}
            </span>
          </button>
        ))}
        {Object.keys(searchFilters).length > 1 && (
          <button className="btn btn-xs btn-outline" onClick={() => clearSearchFilters()}>
            Clear all filters
            <span className="badge badge-accent badge-sm">{Object.keys(searchFilters).length}</span>
          </button>
        )}
        {!Object.keys(searchFilters).length && <br></br>}
      </div>
    </div>
  );
};
