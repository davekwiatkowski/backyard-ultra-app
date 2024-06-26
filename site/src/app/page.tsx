import { promises as fs } from 'fs';
import { IResultItem } from '../types/IResultItem';
import { Client } from '../components/Client';
import { IMetadata } from '../types/IMetadata';

export default async function Landing() {
  const resultsDataFile = await fs.readFile(process.cwd() + '/src/data/results.json', 'utf8');
  const resultsData: IResultItem[] = JSON.parse(resultsDataFile);

  const metadataFile = await fs.readFile(process.cwd() + '/src/data/metadata.json', 'utf8');
  const metadata: IMetadata = JSON.parse(metadataFile);

  const mostRecentDate = resultsData.map((v) => v['date']).sort((a, b) => b.localeCompare(a))[0];
  const recentRanks = resultsData.filter((v) => v.date === mostRecentDate);
  const racesCount = resultsData
    .map((v) => v['race'])
    .filter((item, i, ar) => ar.indexOf(item) === i).length;

  const countries = resultsData.reduce((acc, obj) => {
    if (!acc.includes(obj.nat2)) {
      acc.push(obj.nat2);
    }
    return acc;
  }, [] as string[]);

  return (
    <Client
      racesCount={racesCount}
      data={resultsData}
      metadata={metadata}
      recentResultsCount={recentRanks.length}
      mostRecentDate={mostRecentDate}
      countriesCount={countries.length}
    />
  );
}
