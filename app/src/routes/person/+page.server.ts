import type { IRanking } from "../../types/IRanking";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
    const data: { [window: string]: IRanking[] } = await (await fetch('/data/person-rankings.json')).json();
    const personKeys = Object.keys(data)
    return { personKeys };
}) satisfies PageServerLoad;