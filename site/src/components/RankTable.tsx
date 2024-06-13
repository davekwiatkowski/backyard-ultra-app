'use client';

import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { MAX_ITEMS_PER_PAGE } from "../constants/TableConstants";
import { searchObjectArray } from "../util/searchObjectArray";
import { IRankDataItem } from "../types/IRankDataItem";
import { getFlagEmoji } from "../util/getFlagEmoji";

export function RankTable(props: { data: IRankDataItem[] }) {
    const [searchValue, setSearchValue] = useState('');
    const [currentData, setCurrentData] = useState(props.data);
    const [page, setPage] = useState(0);
    const [currentPageData, setCurrentPageData] = useState(props.data.slice(0, MAX_ITEMS_PER_PAGE));
    const [sortCol, setSortCol] = useState<keyof IRankDataItem>('rank');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const maxPage = useMemo(() => Math.floor(currentData.length / MAX_ITEMS_PER_PAGE), [currentData]);

    const handleSearch: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setSearchValue(e.target.value);
        setPage(0);
    }, []);

    const handlePrevious = useCallback(() => {
        if (page - 1 < 0) return;
        setPage(page - 1);
    }, [page]);

    const handleNext = useCallback(() => {
        if (page + 1 > maxPage) return;
        setPage(page + 1)
    }, [maxPage, page]);

    const handleSort = useCallback((col: keyof IRankDataItem) => {
        if (sortCol === col) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        }
        setSortCol(col);
    }, [sortCol, sortDir]);

    useEffect(() => {
        const newCurrentData = [...searchObjectArray(props.data, searchValue)];
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
    }, [props.data, searchValue, sortCol, sortDir]);

    useEffect(() => {
        setCurrentPageData(currentData.slice(page * MAX_ITEMS_PER_PAGE, (page + 1) * MAX_ITEMS_PER_PAGE));
    }, [currentData, page]);

    return <div>
        <div className="p-4">
            <label className="input input-bordered flex items-center gap-2 w-fit">
                <input type="text" className="grow" placeholder="Search" onChange={handleSearch} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
        </div>
        <div className="overflow-x-auto p-4">
            <table className='table'>
                <thead>
                    <tr>
                        <th><button className="btn btn-xs" onClick={() => handleSort('rank')}>Rank</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('yards')}>Yards</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('name')}>Name</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('natFull')}>Nationality</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('race')}>Race</button></th>
                        <th><button className="btn btn-xs" onClick={() => handleSort('date')}>Date</button></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentPageData.map(item => {
                            return <tr key={item.id}>
                                <td>{item.rank}</td>
                                <td>{item.yards}</td>
                                <td>{item.name}</td>
                                <td>{getFlagEmoji(item.nat2)} {item.natFull}</td>
                                <td>{item.race}</td>
                                <td>{item.date}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className="p-4 flex flex-col items-center justify-center">
            <div className="join grid grid-cols-2 w-fit">
                <button className="join-item btn btn-outline" disabled={page - 1 < 0} onClick={handlePrevious}>Previous</button>
                <button className="join-item btn btn-outline" disabled={page + 1 >= maxPage} onClick={handleNext}>Next</button>
            </div>
            <div className="flex items-center p-4 justify-center text-sm">Page {page + 1}</div>
        </div>
    </div>
}