'use client';

import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MAX_ITEMS_PER_PAGE } from '../constants/TableConstants';
import { searchObjectArray } from '../util/searchObjectArray';
import { IResultItem } from '../types/IResultItem';
import { getFlagEmoji } from '../util/getFlagEmoji';
import { ResultsContext } from '../context/ResultsContext';
import { TableSortButton } from './SortButton';
import { SortDirection } from '../types/SortDirection';

export const ResultTable: FC<{
  data: IResultItem[];
}> = ({ data }) => {
  const [currentData, setCurrentData] = useState(data);
  const [currentPageData, setCurrentPageData] = useState(data.slice(0, MAX_ITEMS_PER_PAGE));
  const [showPBsOnly, setShowPBsOnly] = useState(false);

  const {
    searchFilters,
    searchText,
    addSearchFilter,
    page,
    setPage,
    sorts,
    sortBy,
    clearSorting,
    clearSearchFilters,
    clearSearchText,
  } = useContext(ResultsContext);

  const maxPage = useMemo(() => Math.ceil(currentData.length / MAX_ITEMS_PER_PAGE), [currentData]);

  const handlePrevious = useCallback(() => {
    if (page - 1 < 0) return;
    setPage(page - 1);
  }, [page, setPage]);

  const handleNext = useCallback(() => {
    if (page + 1 > maxPage) return;
    setPage(page + 1);
  }, [maxPage, page, setPage]);

  const handleNoResultsClick = useCallback(() => {
    clearSearchText();
    clearSearchFilters();
  }, [clearSearchFilters, clearSearchText]);

  useEffect(() => {
    const newCurrentData = [...searchObjectArray(data, searchText, searchFilters)].filter(
      (value) => !showPBsOnly || value.isPersonalBest,
    );
    const sortsArray = Object.entries(sorts) as [
      keyof IResultItem,
      { dir: SortDirection; priority: number },
    ][];
    sortsArray
      .sort((a, b) => b[1].priority - a[1].priority)
      .map(([key, value]) => ({ key, dir: value.dir }))
      .forEach(({ key, dir }) => {
        if (dir === undefined) return;
        newCurrentData.sort((a, b) => {
          if (dir === 'desc') {
            const temp = a;
            a = b;
            b = temp;
          }
          if (!a[key]) return -1;
          if (!b[key]) return 1;
          if (typeof a[key] === 'number') {
            return (a[key] as number) - (b[key] as number);
          }
          return a[key].toString().localeCompare(b[key].toString());
        });
      });
    setCurrentData(newCurrentData);
  }, [data, searchFilters, searchText, showPBsOnly, sorts]);

  useEffect(() => {
    setCurrentPageData(
      currentData.slice(page * MAX_ITEMS_PER_PAGE, (page + 1) * MAX_ITEMS_PER_PAGE),
    );
  }, [currentData, page]);

  return (
    <div>
      <div>
        <div className="pb-4 flex justify-between items-center">
          <button
            className="btn btn-xs btn-outline"
            disabled={!Object.keys(sorts).length}
            onClick={() => clearSorting()}
          >
            Clear all sorting
            {!!Object.keys(sorts).length && (
              <span className="badge badge-accent badge-sm">{Object.keys(sorts).length}</span>
            )}
          </button>
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">{showPBsOnly ? 'Only PBs' : 'All results'}</span>
              <input
                type="checkbox"
                className="toggle"
                checked={showPBsOnly}
                onChange={() => {
                  setShowPBsOnly(!showPBsOnly);
                }}
              />
            </label>
          </div>
        </div>
        <div className="h-[407px] sm:h-[595px] md:h-[723px] overflow-x-auto">
          {!currentPageData.length && (
            <div className="justify-center items-center flex h-full w-full flex-col gap-4">
              {!searchText && !Object.keys(searchFilters).length && (
                <span>Oops! No results 😟</span>
              )}
              {!!searchText && (
                <>
                  <span>
                    No results for &quot;{searchText}&quot;
                    {!!Object.keys(searchFilters).length && <span> with filters</span>}
                  </span>
                  <button className="btn btn-secondary btn-sm" onClick={handleNoResultsClick}>
                    <span>
                      Clear search
                      {!!Object.keys(searchFilters).length && <span> and filters</span>}
                    </span>
                  </button>
                </>
              )}
              {!searchText && !!Object.keys(searchFilters).length && (
                <>
                  <span>No results for filters</span>
                  <button className="btn btn-secondary btn-sm" onClick={handleNoResultsClick}>
                    <span>Clear filters</span>
                  </button>
                </>
              )}
            </div>
          )}
          {!!currentPageData.length && (
            <table className="table table-xs sm:table-sm md:table-md">
              <thead>
                <tr>
                  <th>
                    <TableSortButton
                      title="Rank"
                      dir={sorts.rankResultAllTime?.dir}
                      onSort={() => sortBy('rankResultAllTime')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Yards"
                      dir={sorts.yards?.dir}
                      onSort={() => sortBy('yards')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Place"
                      dir={sorts.eventPlace?.dir}
                      onSort={() => sortBy('eventPlace')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Name"
                      dir={sorts.name?.dir}
                      onSort={() => sortBy('name')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Race"
                      dir={sorts.race?.dir}
                      onSort={() => sortBy('race')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Date"
                      dir={sorts.date?.dir}
                      onSort={() => sortBy('date')}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => {
                  return (
                    <tr
                      key={item.firstName + '-' + item.lastName + '-' + item.date + '-' + item.race}
                    >
                      <td className="whitespace-nowrap">{item.rankResultAllTime}</td>
                      <td className="whitespace-nowrap">
                        <div className="flex flex-row justify-between gap-2">
                          <span>{item.yards}</span>
                          <span className="flex gap-1">
                            {item.seasonBests.map((year) => {
                              if (!year) return;
                              return (
                                <span
                                  key={year}
                                  className="tooltip text-accent font-bold"
                                  data-tip={`Best towards Big's ${year}`}
                                >
                                  {`${year}`.substring(2)}
                                </span>
                              );
                            })}
                            <span className="tooltip" data-tip="Personal best">
                              {item.isPersonalBest && '🏅'}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        {(item.eventPlace === 'W'
                          ? 'Win'
                          : item.eventPlace === 'A'
                            ? 'Assist'
                            : null) ?? `DNF (${item.eventRank})`}
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          className={`link ${item.gender === 'F' && 'text-primary'}`}
                          onClick={() => addSearchFilter('personId', item.personId)}
                        >
                          <span className="tooltip mr-1" data-tip={item.natFull}>
                            {getFlagEmoji(item.nat2)}
                          </span>
                          {item.name}
                        </button>
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          className="link"
                          onClick={() => addSearchFilter('eventId', item.eventId)}
                        >
                          <span className="tooltip mr-1" data-tip={item.eventNatFull}>
                            {getFlagEmoji(item.eventNat2)}
                          </span>
                          {item.race}
                        </button>
                      </td>
                      <td className="whitespace-nowrap">
                        <button className="link" onClick={() => addSearchFilter('date', item.date)}>
                          {item.date}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-4 pt-4">
          <div className="join grid grid-cols-2 w-fit">
            <button
              className="join-item btn btn-outline"
              disabled={page - 1 < 0}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-outline"
              disabled={page + 1 >= maxPage}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
          <div className="flex text-xs items-center justify-center">
            Page {page + 1} / {maxPage}
          </div>
        </div>
        <div className="flex-0 p-4 flex italic flex-col gap-2 text-xs">
          Showing {MAX_ITEMS_PER_PAGE} per page
        </div>
      </div>
    </div>
  );
};
