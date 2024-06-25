import { FC, useContext } from 'react';
import { ResultsContext } from '../context/ResultsContext';

export const Statistics: FC<{
  recentResultsCount: number;
  racesCount: number;
  countriesCount: number;
  mostRecentDate: string;
  resultsCount: number;
}> = ({ recentResultsCount, mostRecentDate, countriesCount, racesCount, resultsCount }) => {
  const { addSearchFilter } = useContext(ResultsContext);

  return (
    <div className="stats stats-horizontal shadow">
      <div className="stat place-items-center">
        <div className="stat-title">Latest results</div>
        <div className="stat-value">{recentResultsCount}</div>
        <div className="stat-desc">
          Held on{' '}
          <button
            className="link link-primary"
            onClick={() => addSearchFilter('date', mostRecentDate)}
          >
            {mostRecentDate}
          </button>
        </div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">Total results</div>
        <div className="stat-value">{resultsCount.toLocaleString()}</div>
        <div className="stat-desc">With 7+ yards</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">Events</div>
        <div className="stat-value">{racesCount}</div>
        <div className="stat-desc">Worldwide</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">Countries</div>
        <div className="stat-value">{countriesCount}</div>
        <div className="stat-desc">With backyard results</div>
      </div>
    </div>
  );
};
