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
import { TeamStatus } from '../types/TeamStatus';
import { DistanceType, distanceTypes } from '../types/DistanceType';
import { usePersistState } from '../util/hooks/usePersistState';
import { StorageKeyConstants } from '../constants/StorageKeyConstants';

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
  const [distanceType, setDistanceType] = usePersistState<DistanceType>(
    DistanceType.Yards,
    StorageKeyConstants.DISTANCE_TYPE,
  );

  const maxPage = useMemo(() => Math.ceil(currentData.length / MAX_ITEMS_PER_PAGE), [currentData]);

  const isBest = useMemo(() => {
    const seasonBest = searchFilters.seasonBests?.[0];
    if (seasonBest) {
      return true;
    }
    return !!searchFilters.isPersonalBest?.[0];
  }, [searchFilters.isPersonalBest, searchFilters.seasonBests]);

  const bestToggleText = useMemo(() => {
    const seasonBest = searchFilters.seasonBests?.[0];
    if (seasonBest) {
      return 'Season bests';
    }
    return searchFilters.isPersonalBest?.[0] ? 'Personal bests' : 'All results';
  }, [searchFilters.isPersonalBest, searchFilters.seasonBests]);

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

  const handleBestChange: ChangeEventHandler<HTMLInputElement> = useCallback(() => {
    const season = searchFilters.seasons?.[0];
    if (season) {
      if (isBest) {
        removeSearchFilters(['seasonBests']);
      } else {
        replaceSearchFilters({ seasonBests: season }, ['seasonBests']);
      }
    } else {
      if (isBest) {
        removeSearchFilters(['isPersonalBest']);
      } else {
        replaceSearchFilters({ isPersonalBest: 'true' }, ['isPersonalBest']);
      }
    }
  }, [isBest, removeSearchFilters, replaceSearchFilters, searchFilters.seasons]);

  const onSeasonSelectorChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      const selected = e.currentTarget.value;
      if (seasons.includes(parseInt(selected))) {
        if (isBest) {
          replaceSearchFilters({ seasons: selected, seasonBests: selected }, [
            'seasons',
            'isPersonalBest',
            'seasonBests',
          ]);
        } else {
          replaceSearchFilters({ seasons: selected }, ['seasons']);
        }
      } else {
        if (isBest) {
          replaceSearchFilters({ isPersonalBest: 'true' }, [
            'seasons',
            'isPersonalBest',
            'seasonBests',
          ]);
        } else {
          removeSearchFilters(['seasons']);
        }
      }
    },
    [isBest, removeSearchFilters, replaceSearchFilters, seasons],
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
          const aVal = a[key];
          const bVal = b[key];
          if (!aVal) return -1;
          if (!bVal) return 1;
          if (typeof aVal === 'number') {
            return (aVal as number) - (bVal as number);
          }
          return aVal.toString().localeCompare(bVal.toString());
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
        <div className="pb-4 flex gap-4 flex-wrap items-center">
          <select
            value={searchFilters.seasons?.[0] ?? 'all'}
            className="select select-bordered w-fit max-w-xs select-sm"
            onChange={onSeasonSelectorChange}
          >
            <option value="all">All-time</option>
            {seasons
              .sort((a, b) => b - a)
              .map((season) => (
                <option value={season} key={season}>
                  {`${season - 2}-${season}`}
                </option>
              ))}
          </select>
          <select
            value={distanceType}
            className="select select-bordered w-fit max-w-xs select-sm"
            onChange={(e) => setDistanceType(e.currentTarget.value as DistanceType)}
          >
            {distanceTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">{bestToggleText}</span>
              <input
                type="checkbox"
                className="toggle toggle-sm"
                checked={isBest}
                onChange={handleBestChange}
              />
            </label>
          </div>
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
                      title={distanceType}
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
                  <th>{'Bests'}</th>
                  <th>
                    <TableSortButton
                      title="Team status"
                      dir={sorts.teamStatus?.dir}
                      onSort={() => sortBy('teamStatus')}
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
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        <div className="flex flex-row justify-between gap-1 items-center">
                          {distanceType === DistanceType.Yards && <span>{item.yards}</span>}
                          {distanceType === DistanceType.Kilometers && (
                            <span>{(item.yards * 6.70558).toFixed(2)}</span>
                          )}
                          {distanceType === DistanceType.Miles && (
                            <span>{(item.yards * 4.16666).toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        {(item.eventPlace === 'W'
                          ? 'Win'
                          : item.eventPlace === 'A'
                            ? 'Assist'
                            : null) ?? `DNF (${item.eventRank})`}
                        {item.awardWon && (
                          <button
                            className="tooltip btn btn-xs btn-ghost btn-circle ml-1"
                            data-tip={`${item.awardWon}${item.raceQualifiedFor ? ` towards ${item.raceQualifiedFor}` : ''}`}
                            onClick={() =>
                              replaceSearchFilters({ awardWon: item.awardWon }, ['awardWon'])
                            }
                          >
                            {item.awardWon === 'Championship' && '🏆'}
                            {item.awardWon === 'Gold' && '🥇'}
                            {item.awardWon === 'Silver' && '🥈'}
                            {item.awardWon === 'Bronze' && '🥉'}
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          onClick={() => addSearchFilter('nat2', item.nat2)}
                          className="tooltip btn btn-xs btn-ghost btn-circle mr-1"
                          data-tip={'from ' + item.natFull}
                        >
                          {getFlagEmoji(item.nat2)}
                        </button>
                        <button
                          className={`link ${item.gender === 'F' && 'text-secondary'}`}
                          onClick={() => addSearchFilter('personId', item.personId)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="whitespace-nowrap flex items-center">
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
                        {item.eventAward && (
                          <button
                            className="tooltip btn btn-xs btn-ghost btn-circle ml-1"
                            data-tip={`${item.eventAward}${item.raceQualifiedFor ? ` towards ${item.raceQualifiedFor}` : ''}`}
                            onClick={() =>
                              replaceSearchFilters({ eventAward: item.eventAward }, ['eventAward'])
                            }
                          >
                            {item.eventAward === 'Championship' && '🏆'}
                            {item.eventAward === 'Gold' && '🥇'}
                            {item.eventAward === 'Silver' && '🥈'}
                            {item.eventAward === 'Bronze' && '🥉'}
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="flex gap-1">
                          {item.seasonBests.map((year) => {
                            if (!year) return;
                            return (
                              <button
                                key={year}
                                onClick={() => {
                                  replaceSearchFilters(
                                    { seasonBests: `${year}`, seasons: `${year}` },
                                    ['isPersonalBest', 'seasonBests', 'seasons'],
                                  );
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
                                replaceSearchFilters({ isPersonalBest: `${true}` }, [
                                  'seasonBests',
                                  'seasons',
                                ]);
                              }}
                            >
                              {item.isPersonalBest && '🌟'}
                            </button>
                          )}
                        </span>
                      </td>
                      <td>
                        {!!item.teamStatus && (
                          <button
                            className="link tooltip"
                            data-tip={'Team eligibility: ' + item.teamStatus}
                            onClick={() => addSearchFilter('teamStatus', item.teamStatus)}
                          >
                            {item.teamStatus}
                          </button>
                        )}
                        {(item.teamStatus === 'At-large' ||
                          item.teamStatus === 'Silver ticket') && (
                          <button
                            className="tooltip btn btn-xs btn-ghost btn-circle ml-1"
                            data-tip={`On team ${item.nat3}`}
                            onClick={() => {
                              replaceSearchFilters(
                                {
                                  teamStatus: [
                                    'At-large',
                                    'Silver ticket',
                                    'Alternate',
                                  ] as TeamStatus[],
                                  nat2: item.nat2,
                                },
                                ['teamStatus', 'nat2'],
                              );
                              sortBy('teamStatus', 'desc');
                            }}
                          >
                            {getFlagEmoji(item.nat2)}
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          className="link"
                          onClick={() => addSearchFilter('date', item.date)}
                          suppressHydrationWarning
                        >
                          {new Date(item.date).toLocaleDateString(undefined, {
                            dateStyle: 'medium',
                          })}
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
