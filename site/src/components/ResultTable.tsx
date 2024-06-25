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
  const [sorts, setSorts] = useState<{
    [key in keyof Partial<IResultItem>]: { dir: SortDirection; priority: number };
  }>({});

  const { searchFilters, searchText, setSearchText, addSearchFilter, page, setPage } =
    useContext(ResultsContext);

  const maxPage = useMemo(() => Math.ceil(currentData.length / MAX_ITEMS_PER_PAGE), [currentData]);

  const handlePrevious = useCallback(() => {
    if (page - 1 < 0) return;
    setPage(page - 1);
  }, [page, setPage]);

  const handleNext = useCallback(() => {
    if (page + 1 > maxPage) return;
    setPage(page + 1);
  }, [maxPage, page, setPage]);

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
    [sorts],
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

  useEffect(() => {
    setPage(0);
  }, [searchText, setPage]);

  return (
    <div>
      <div>
        <div className="pb-4">
          <button
            className="btn btn-xs btn-outline"
            disabled={!Object.keys(sorts).length}
            onClick={() => setSorts({})}
          >
            Clear all sorting
            {!!Object.keys(sorts).length && (
              <span className="badge badge-accent badge-sm">{Object.keys(sorts).length}</span>
            )}
          </button>
        </div>
        <div className="h-[407px] sm:h-[595px] md:h-[723px] overflow-x-auto">
          {!currentPageData.length && (
            <div className="justify-center items-center flex h-full w-full flex-col gap-4">
              No results for &quot;{searchText}&quot;
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchText('')}>
                Clear search
              </button>
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
                      onSort={() => handleSort('rankResultAllTime')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Yards"
                      dir={sorts.yards?.dir}
                      onSort={() => handleSort('yards')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Place"
                      dir={sorts.eventPlace?.dir}
                      onSort={() => handleSort('eventPlace')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Name"
                      dir={sorts.name?.dir}
                      onSort={() => handleSort('name')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Gender"
                      dir={sorts.gender?.dir}
                      onSort={() => handleSort('gender')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Nationality"
                      dir={sorts.natFull?.dir}
                      onSort={() => handleSort('natFull')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Race"
                      dir={sorts.race?.dir}
                      onSort={() => handleSort('race')}
                    />
                  </th>
                  <th>
                    <TableSortButton
                      title="Date"
                      dir={sorts.date?.dir}
                      onSort={() => handleSort('date')}
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
                      <td className="whitespace-nowrap">{item.yards}</td>
                      <td className="whitespace-nowrap">
                        {(item.eventPlace === 'W'
                          ? 'Win'
                          : item.eventPlace === 'A'
                            ? 'Assist'
                            : null) ?? `DNF (${item.eventRank})`}
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          className="link"
                          onClick={() => addSearchFilter('personId', item.personId)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          className="link"
                          onClick={() => addSearchFilter('gender', item.gender)}
                        >
                          {item.gender}
                        </button>
                      </td>
                      <td className="whitespace-nowrap">
                        <button
                          className="link"
                          onClick={() => addSearchFilter('natFull', item.natFull)}
                        >
                          {getFlagEmoji(item.nat2)} {item.natFull}
                        </button>
                      </td>
                      <td className="whitespace-nowrap">
                        <button className="link" onClick={() => addSearchFilter('race', item.race)}>
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
