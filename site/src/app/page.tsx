import { promises as fs } from 'fs';
import RankTable from '../components/RankTable';
import IRankDataItem from '../types/IRankDataItem';

async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/data/window-rankings.json', 'utf8');
  const data: IRankDataItem[] = JSON.parse(file)['All-Time'];

  return <main>
    <h1 className='p-4 text-3xl'>All time rankings</h1>
    <div>
      <RankTable data={data} />
    </div>
  </main>
}

export default Home;