import type { IRanking } from '../../../types/IRanking';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    const personRankingsData: { [name: string]: IRanking[] } = await (await fetch('/data/person-rankings.json')).json();
    return { personRankingsData, currentPersonId: params.slug };
}) satisfies LayoutLoad;