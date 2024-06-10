import type { IRanking } from '../../../types/IRanking.js';
import type { PageServerLoad } from './$types.js';

export const load = (async ({ fetch, params }) => {
    const data: { [window: string]: IRanking[] } = await (await fetch('/data/person-rankings.json')).json();
    const personRankingsData = data[params.slug];
    return { personRankingsData };
}) satisfies PageServerLoad;