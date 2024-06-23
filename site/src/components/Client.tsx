'use client';

import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { IResultItem } from "../types/IResultItem";
import { ResultTable } from "./ResultTable";
import { PageWrapper } from "./PageWrapper";
import { SearchBar } from "./SearchBar";
import { useSetSearchKeyValuePair } from "../util/useSetSearchKeyValuePair";

type TabType = 'table' | 'chart';

export const Client: FC<{
    data: IResultItem[],
    recentResultsCount: number,
    mostRecentDate: string,
    countriesCount: number,
    version: string,
    racesCount: number,
}> = ({ version, data, recentResultsCount, mostRecentDate, countriesCount, racesCount }) => {
    const [searchText, setSearchText] = useState('');
    const [currentTab, setCurrentTab] = useState<TabType>('table');

    const searchKeyValuePair = useSetSearchKeyValuePair(searchText, data);

    const handleRecentDateClick = useCallback(() => {
        setSearchText(`date:${mostRecentDate}`);
    }, [mostRecentDate]);
    const handleTabChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        setCurrentTab(event.currentTarget.name as TabType);
    }, []);

    return <PageWrapper version={version}>
        <div className='flex justify-between items-start'>
            <div className='p-4'>
                <h1 className='text-3xl'>Results</h1>
                <p className='italic text-sm'>Note: Only includes runners who completed 7+ yards</p>
            </div>
            <div className="p-2 overflow-auto">
                <div className="stats stats-horizontal shadow">
                    <div className="stat place-items-center">
                        <div className="stat-title">Latest results</div>
                        <div className="stat-value">{recentResultsCount}</div>
                        <div className="stat-desc">
                            Held on {' '}
                            <button className="btn-link" onClick={handleRecentDateClick}>{mostRecentDate}</button>
                        </div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">Countries</div>
                        <div className="stat-value">{countriesCount}</div>
                        <div className="stat-desc">With backyard results</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">Events</div>
                        <div className="stat-value">{racesCount}</div>
                        <div className="stat-desc">
                            Worldwide
                        </div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">Results</div>
                        <div className="stat-value">{data.length.toLocaleString()}</div>
                        <div className="stat-desc">With 7+ yards</div>
                    </div>
                </div>
            </div>
        </div>
        <SearchBar searchKeyValuePair={searchKeyValuePair} searchText={searchText} onSearchTextChange={setSearchText} />
        <div role="tablist" className="tabs tabs-lifted p-4">
            <input type="radio" name="table" role="tab" className="tab" aria-label="Table" onChange={handleTabChange} checked={currentTab === 'table'} />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-x-hidden">
                <ResultTable searchKeyValuePair={searchKeyValuePair} data={data} searchText={searchText} onSearchTextChange={setSearchText} />
            </div>
            <input type="radio" name="chart" role="tab" className="tab" aria-label="Chart" onChange={handleTabChange} checked={currentTab === 'chart'} />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-x-hidden">
                TODO: Put chart here...
            </div>
        </div>
    </PageWrapper >
}