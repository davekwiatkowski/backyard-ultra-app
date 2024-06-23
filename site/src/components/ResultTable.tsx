'use client';

import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_ITEMS_PER_PAGE } from "../constants/TableConstants";
import { searchObjectArray } from "../util/searchObjectArray";
import { IResultItem } from "../types/IResultItem";
import { getFlagEmoji } from "../util/getFlagEmoji";
import { ResultsContext } from "../context/ResultsContext";

export const ResultTable: FC<{
    data: IResultItem[],
}> = ({ data }) => {
    const [currentData, setCurrentData] = useState(data);
    const [currentPageData, setCurrentPageData] = useState(data.slice(0, MAX_ITEMS_PER_PAGE));
    const [sortCol, setSortCol] = useState<keyof IResultItem>('yards');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const { searchFilters, searchText, addSearchFilter, page, setPage } = useContext(ResultsContext);

    const maxPage = useMemo(() => Math.ceil(currentData.length / MAX_ITEMS_PER_PAGE), [currentData]);

    const handlePrevious = useCallback(() => {
        if (page - 1 < 0) return;
        setPage(page - 1);
    }, [page]);
    const handleNext = useCallback(() => {
        if (page + 1 > maxPage) return;
        setPage(page + 1)
    }, [maxPage, page]);
    const handleSort = useCallback((col: keyof IResultItem) => {
        if (sortCol === col) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        }
        setSortCol(col);
    }, [sortCol, sortDir]);

    useEffect(() => {
        const newCurrentData = [...searchObjectArray(data, searchText, searchFilters)];
        if (sortCol) {
            newCurrentData.sort((a, b) => {
                if (sortDir === 'desc') {
                    const temp = a;
                    a = b;
                    b = temp;
                }
                if (!a[sortCol]) return -1;
                if (!b[sortCol]) return 1;
                if (typeof a[sortCol] === 'number') {
                    return (a[sortCol] as number) - (b[sortCol] as number);
                }
                return a[sortCol].toString().localeCompare(b[sortCol].toString());
            })
        }
        setCurrentData(newCurrentData);
    }, [data, searchFilters, searchText, sortCol, sortDir]);

    useEffect(() => {
        setCurrentPageData(currentData.slice(page * MAX_ITEMS_PER_PAGE, (page + 1) * MAX_ITEMS_PER_PAGE));
    }, [currentData, page]);

    useEffect(() => {
        setPage(0);
    }, [searchText]);

    return <div>
        <div className="overflow-x-auto min-h-[620px] sm:min-h-[750px]">
            <table className='table table-sm sm:table-md'>
                <thead>
                    <tr>
                        <th><button className="btn btn-xs" onClick={() => handleSort('rankResultAllTime')}>Rank</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('yards')}>Yards</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('eventPlace')}>Place</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('name')}>Name</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('gender')}>Gender</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('natFull')}>Nationality</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('race')}>Race</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('date')}>Date</button></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentPageData.map(item => {
                            return <tr key={item.firstName + '-' + item.lastName + '-' + item.date + '-' + item.race}>
                                <td className='whitespace-nowrap'>{item.rankResultAllTime}</td>
                                <td className='whitespace-nowrap'>{item.yards}</td>
                                <td className='whitespace-nowrap'>
                                    {
                                        (item.eventPlace === 'W' ? 'Win'
                                            : item.eventPlace === 'A' ? 'Assist'
                                                : null)
                                        ?? `DNF (${item.eventRank})`
                                    }
                                </td>
                                <td className='whitespace-nowrap'><button className="link" onClick={() => addSearchFilter('personId', item.personId)}>{item.name}</button></td>
                                <td className='whitespace-nowrap'><button className="link" onClick={() => addSearchFilter('gender', item.gender)}>{item.gender}</button></td>
                                <td className='whitespace-nowrap'><button className="link" onClick={() => addSearchFilter('natFull', item.natFull)}>{getFlagEmoji(item.nat2)} {item.natFull}</button></td>
                                <td className='whitespace-nowrap'><button className="link" onClick={() => addSearchFilter('race', item.race)}>{item.race}</button></td>
                                <td className='whitespace-nowrap'><button className="link" onClick={() => addSearchFilter('date', item.date)}>{item.date}</button></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className="p-4 flex flex-row items-center justify-between">
            <div className="flex flex-col gap-4 pt-4">
                <div className="join grid grid-cols-2 w-fit">
                    <button className="join-item btn btn-outline" disabled={page - 1 < 0} onClick={handlePrevious}>Previous</button>
                    <button className="join-item btn btn-outline" disabled={page + 1 >= maxPage} onClick={handleNext}>Next</button>
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
}