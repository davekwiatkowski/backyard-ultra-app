import type { IRanking } from '../types/IRanking.js';
import type { LayoutLoadEvent } from './$types.js';

export async function load({ fetch }: LayoutLoadEvent) {
    const personRankingsData: { [name: string]: IRanking[] } = await (await fetch('/data/person-rankings.json')).json();
    const dateWindowRankingsData: { [window: string]: IRanking[] } = await (await fetch('/data/date-window-rankings.json')).json();
    return { personRankingsData, dateWindowRankingsData };
}
