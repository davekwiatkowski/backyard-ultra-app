import { promises as fs } from 'fs';
import { IResultItem } from '../types/IResultItem';
import { Client } from '../components/Client';
import getConfig from 'next/config';

const config = getConfig();
const version = config.publicRuntimeConfig.version;

export default async function Landing() {
  const file = await fs.readFile(process.cwd() + '/src/data/results.json', 'utf8');
  const data: IResultItem[] = JSON.parse(file);
  const mostRecentDate = data.map(v => v['date']).sort((a, b) => b.localeCompare(a))[0]
  const recentRanks = data.filter(v => v.date === mostRecentDate);
  const countries = data.reduce((acc, obj) => {
    if (!acc.includes(obj.nat2)) {
      acc.push(obj.nat2);
    }
    return acc;
  }, [] as string[]);

  return <Client version={version} data={data} recentResultsCount={recentRanks.length} mostRecentDate={mostRecentDate} countriesCount={countries.length} />
}
