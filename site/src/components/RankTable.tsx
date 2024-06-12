'use client';

import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import IRankDataItem from "../types/IRankDataItem";
import { MAX_ITEMS_PER_PAGE } from "../constants/TableConstants";
import searchObjectArray from "../util/searchObjectArray";

function RankTable(props: { data: IRankDataItem[] }) {
    const [searchValue, setSearchValue] = useState('');
    const [currentData, setCurrentData] = useState(props.data);
    const [currentPageData, setCurrentPageData] = useState(props.data.slice(0, MAX_ITEMS_PER_PAGE))
    const maxPage = useMemo(() => Math.floor(currentData.length / MAX_ITEMS_PER_PAGE), [currentData]);

    const [page, setPage] = useState(0);

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
    }, [page, props.data.length]);

    useEffect(() => {
        setCurrentData(searchObjectArray(props.data, searchValue));
    }, [page, props.data, searchValue]);

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
                        <th>Rank</th>
                        <th>Yards</th>
                        <th>Name</th>
                        <th>Nationality</th>
                        <th>Race</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentPageData.map(item => {
                            return <tr key={item.id}>
                                <td>{item.rank}</td>
                                <td>{item.yards}</td>
                                <td>{item.name}</td>
                                <td>{item.natFull}</td>
                                <td>{item.race}</td>
                                <td>{item.date}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className="p-4 flex items-center justify-center">
            <div className="join grid grid-cols-2 w-fit">
                <button className="join-item btn btn-outline" disabled={page - 1 < 0} onClick={handlePrevious}>Previous</button>
                <button className="join-item btn btn-outline" disabled={page + 1 >= maxPage} onClick={handleNext}>Next</button>
            </div>
        </div>
    </div>
}

export default RankTable;