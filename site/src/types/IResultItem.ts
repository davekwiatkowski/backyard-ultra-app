import { TeamStatus } from './TeamStatus';

export interface IResultItem {
  yards: number;
  rankResultAllTime: number;
  // person name
  name: string;
  firstName: string;
  lastName: string;
  // person details
  gender: string;
  personId: string;
  // bests
  isPersonalBest: boolean;
  // nat
  nat2: string;
  nat3: string;
  natFull: string;
  // event
  race: string;
  eventId: string;
  eventPlace: string;
  eventRank: string;
  date: string;
  // event nat
  eventNat2: string;
  eventNat3: string;
  eventNatFull: string;
  // tickets
  eventAward: 'Bronze' | 'Silver' | 'Gold' | 'Championship' | null;
  awardWon: 'Bronze' | 'Silver' | 'Gold' | 'Championship' | null;
  raceQualifiedFor: string;
  // seasons
  seasons: number[];
  seasonBests: number[];
  // qualification
  teamStatus: TeamStatus | null;
}
