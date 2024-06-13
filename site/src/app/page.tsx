import { promises as fs } from 'fs';
import { IRankDataItem } from '../types/IRankDataItem';
import { RankTable } from '../components/RankTable';

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/data/window-rankings.json', 'utf8');
  const data: IRankDataItem[] = JSON.parse(file)['All-Time'];
  const mostRecentDate = data.map(v => v['date']).sort((a, b) => b.localeCompare(a))[0]
  const recentRanks = data.filter(v => v.date === mostRecentDate);
  const countries = data.reduce((acc, obj) => {
    if (!acc.includes(obj.nat2)) {
      acc.push(obj.nat2);
    }
    return acc;
  }, [] as string[]);

  return <main>
    <div className='flex justify-between items-start'>
      <div className='p-4'>
        <h1 className='text-3xl'>All time rankings</h1>
        <p className='italic'>Only includes runners who completed 24+ yards</p>
      </div>
      <div className='p-4'>
        <div className="stats shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Recently improved</div>
            <div className="stat-value">{recentRanks.length}</div>
            <div className="stat-desc">Improved on {mostRecentDate}</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Countries</div>
            <div className="stat-value">{countries.length}</div>
            <div className="stat-desc">With at least one 24+ result</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Total backyarders</div>
            <div className="stat-value">{data.length.toLocaleString()}</div>
            <div className="stat-desc">With 24+ yards</div>
          </div>
        </div>
      </div>
    </div>
    <RankTable data={data} />
  </main>
}
