/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
    const res = await fetch('/data/backyard-ultra-rankings.json');
    const backyardUltraRankings = await res.json();
    return { backyardUltraRankings };
}

export const prerender = true;
