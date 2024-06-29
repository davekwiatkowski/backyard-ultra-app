import { promises as fs } from 'fs';
import { IResultItem } from '../types/IResultItem';
import { Client } from '../components/Client';
import { IMetadata } from '../types/IMetadata';
import { IEvent } from '../types/IEvent';

export default async function Landing() {
  const resultsDataFile = await fs.readFile(process.cwd() + '/src/data/results.json', 'utf8');
  const resultsData: IResultItem[] = JSON.parse(resultsDataFile);

  const metadataFile = await fs.readFile(process.cwd() + '/src/data/metadata.json', 'utf8');
  const metadata: IMetadata = JSON.parse(metadataFile);

  const seasonsFile = await fs.readFile(process.cwd() + '/src/data/seasons.json', 'utf8');
  const seasons: number[] = JSON.parse(seasonsFile);

  const eventsFile = await fs.readFile(process.cwd() + '/src/data/events.json', 'utf8');
  const events: { [eventId: string]: IEvent[] | undefined } = JSON.parse(eventsFile);

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
      seasons={seasons}
      events={events}
    />
  );
}
