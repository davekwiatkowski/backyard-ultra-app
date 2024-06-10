import type { IRanking } from '../../../types/IRanking.js';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    const data: { [window: string]: IRanking[] } = await (await fetch('/data/window-rankings.json')).json();
    const windowRankingsData = data[params.slug];
    return { windowRankingsData };
}) satisfies PageServerLoad;