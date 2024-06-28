'use client';

import {
  ChangeEventHandler,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MAX_ITEMS_PER_PAGE } from '../constants/TableConstants';
import { searchObjectArray } from '../util/searchObjectArray';
import { IResultItem } from '../types/IResultItem';
import { getFlagEmoji } from '../util/getFlagEmoji';
import { ResultsContext } from '../context/ResultsContext';
import { TableSortButton } from './SortButton';
import { SortDirection } from '../types/SortDirection';

export const ResultTable: FC<{
  data: IResultItem[];
  seasons: number[];
}> = ({ data, seasons }) => {
  const {
    searchFilters,
    searchText,
    page,
    sorts,
    addSearchFilter,
    sortBy,
    setPage,
    clearSorting,
    clearSearchFilters,
    clearSearchText,
    replaceSearchFilters,
    removeSearchFilters,
  } = useContext(ResultsContext);

  const [currentData, setCurrentData] = useState(data);
  const [currentPageData, setCurrentPageData] = useState(data.slice(0, MAX_ITEMS_PER_PAGE));

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

  const seasonSelectorValue = useMemo<'personal-bests' | 'all' | number>(() => {
    const seasonBest = searchFilters.seasonBests?.[0];
    if (seasonBest) {
      return parseInt(seasonBest);
    }
    if (Boolean(searchFilters.isPersonalBest?.[0])) {
      return 'personal-bests';
    }
    return 'all';
  }, [searchFilters]);

  const onSeasonSelectorChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      const selected = e.currentTarget.value;
      if (selected === 'personal-bests') {
        replaceSearchFilters('isPersonalBest', 'true', ['seasonBests']);
      } else if (seasons.includes(parseInt(selected))) {
        replaceSearchFilters('seasonBests', selected, ['seasonBests', 'isPersonalBest']);
      } else {
        removeSearchFilters(['isPersonalBest', 'seasonBests']);
      }
    },
    [removeSearchFilters, replaceSearchFilters, seasons],
  );

  useEffect(() => {
    const newCurrentData = [...searchObjectArray(data, searchText, searchFilters)];
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
  }, [data, searchFilters, searchText, sorts]);

  useEffect(() => {
    setCurrentPageData(
      currentData.slice(page * MAX_ITEMS_PER_PAGE, (page + 1) * MAX_ITEMS_PER_PAGE),
    );
  }, [currentData, page]);

  return (
    <div>
      <div>
        <div className="pb-4 flex gap-4 items-center">
          <select
            value={seasonSelectorValue}
            className="select select-bordered w-fit max-w-xs select-sm"
            onChange={onSeasonSelectorChange}
          >
            <option value="all">All results</option>
            <option value="personal-bests">Personal bests</option>
            {seasons
              .sort((a, b) => b - a)
              .map((season) => (
                <option value={season} key={season}>
                  {`${season - 2}-${season} bests`}
                </option>
              ))}
          </select>
          <button
            className="btn btn-xs btn-outline"
            disabled={!Object.keys(sorts).length}
            onClick={() => clearSorting()}
          >
            Clear sorting
            {!!Object.keys(sorts).length && (
              <span className="badge badge-accent badge-sm">{Object.keys(sorts).length}</span>
            )}
          </button>
        </div>
        <div className="overflow-x-auto">
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
            <table className="table table-xs lg:table-sm">
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
                      <td className="whitespace-nowrap">
                        <div className="flex flex-row justify-between gap-1 items-center">
                          {item.rankResultAllTime.toLocaleString()}
                          <span className="flex gap-1">
                            {item.seasonBests.map((year) => {
                              if (!year) return;
                              return (
                                <button
                                  key={year}
                                  onClick={() => {
                                    replaceSearchFilters('seasonBests', `${year}`, [
                                      'isPersonalBest',
                                      'seasonBests',
                                    ]);
                                  }}
                                  className="btn btn-ghost btn-circle btn-xs tooltip text-accent font-bold"
                                  data-tip={`${year - 2}-${year} best`}
                                >
                                  {`${year}`.substring(2)}
                                </button>
                              );
                            })}
                            {item.isPersonalBest && (
                              <button
                                className="btn btn-ghost btn-circle btn-xs tooltip"
                                data-tip="Personal best"
                                onClick={() => {
                                  replaceSearchFilters('isPersonalBest', `${true}`, [
                                    'seasonBests',
                                  ]);
                                }}
                              >
                                {item.isPersonalBest && '🏅'}
                              </button>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        <div className="flex flex-row justify-between gap-1 items-center">
                          <span>{item.yards}</span>
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
                          onClick={() => addSearchFilter('nat2', item.nat2)}
                          className="tooltip btn btn-xs btn-ghost btn-circle mr-1"
                          data-tip={item.natFull}
                        >
                          {getFlagEmoji(item.nat2)}
                        </button>
                        <button
                          className={`link ${item.gender === 'F' && 'text-primary'}`}
                          onClick={() => addSearchFilter('personId', item.personId)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          onClick={() => addSearchFilter('eventNat2', item.eventNat2)}
                          className="tooltip btn btn-xs btn-ghost btn-circle mr-1"
                          data-tip={item.eventNatFull}
                        >
                          {getFlagEmoji(item.eventNat2)}
                        </button>
                        <button
                          className="link"
                          onClick={() => addSearchFilter('eventId', item.eventId)}
                        >
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
      <div className="p-4 flex flex-row items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-row gap-4 ">
            <div className="flex flex-col gap-2">
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
                Page {page + 1} / {maxPage.toLocaleString()}
              </div>
            </div>
            {page > 0 && (
              <button className="btn btn-square" onClick={() => setPage(0)}>
                Go to start
              </button>
            )}
          </div>
        </div>
        <div className="flex-0 flex italic flex-col gap-2 text-xs">
          Showing {MAX_ITEMS_PER_PAGE} per page
          <span>Out of {currentData.length.toLocaleString()} results</span>
        </div>
      </div>
    </div>
  );
};
