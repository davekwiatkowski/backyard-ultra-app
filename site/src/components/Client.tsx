'use client';

import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { IResultItem } from "../types/IResultItem";
import { ResultTable } from "./ResultTable";
import { PageWrapper } from "./PageWrapper";
import { SearchBar } from "./SearchBar";
import { Statistics } from "./Statistics";

type TabType = 'table' | 'chart';

export const Client: FC<{
    data: IResultItem[],
    recentResultsCount: number,
    mostRecentDate: string,
    countriesCount: number,
    version: string,
    racesCount: number,
}> = ({ version, data, recentResultsCount, mostRecentDate, countriesCount, racesCount }) => {
    const [currentTab, setCurrentTab] = useState<TabType>('table');

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
                <Statistics recentResultsCount={recentResultsCount} countriesCount={countriesCount} racesCount={racesCount} resultsCount={data.length} mostRecentDate={mostRecentDate} />
            </div>
        </div>
        <SearchBar />
        <div role="tablist" className="tabs tabs-lifted p-4">
            <input type="radio" name="table" role="tab" className="tab" aria-label="Table" onChange={handleTabChange} checked={currentTab === 'table'} />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-x-hidden">
                <ResultTable data={data} />
            </div>
            <input type="radio" name="chart" role="tab" className="tab" aria-label="Chart" onChange={handleTabChange} checked={currentTab === 'chart'} />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-x-hidden">
                TODO: Put chart here...
            </div>
        </div>
    </PageWrapper >
}