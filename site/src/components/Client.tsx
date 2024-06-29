'use client';

import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { IResultItem } from '../types/IResultItem';
import { ResultTable } from './ResultTable';
import { PageWrapper } from './PageWrapper';
import { SearchBar } from './SearchBar';
import { Statistics } from './Statistics';
import { IMetadata } from '../types/IMetadata';

type TabType = 'results' | 'countries' | 'people' | 'races';

export const Client: FC<{
  data: IResultItem[];
  metadata: IMetadata;
  recentResultsCount: number;
  mostRecentDate: string;
  countriesCount: number;
  racesCount: number;
  seasons: number[];
}> = ({
  data,
  metadata,
  recentResultsCount,
  mostRecentDate,
  countriesCount,
  racesCount,
  seasons,
}) => {
  const [currentTab, setCurrentTab] = useState<TabType>('results');

  const handleTabChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setCurrentTab(event.currentTarget.name as TabType);
  }, []);

  return (
    <PageWrapper metadata={metadata}>
      <div className="p-4 overflow-auto">
        <Statistics
          recentResultsCount={recentResultsCount}
          countriesCount={countriesCount}
          racesCount={racesCount}
          resultsCount={data.length}
          mostRecentDate={mostRecentDate}
        />
      </div>
      <SearchBar />
      <div role="tablist" className="tabs tabs-lifted p-4 pt-0">
        <input
          type="radio"
          role="tab"
          className="tab"
          name="results"
          aria-label="Results"
          onChange={handleTabChange}
          checked={currentTab === 'results'}
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-x-hidden"
        >
          <ResultTable data={data} seasons={seasons} />
        </div>
      </div>
    </PageWrapper>
  );
};
