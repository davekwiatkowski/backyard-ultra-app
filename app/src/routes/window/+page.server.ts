import type { IRanking } from "../../types/IRanking";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
    const data: { [window: string]: IRanking[] } = await (await fetch('/data/window-rankings.json')).json();
    const windowKeys = Object.keys(data)
    return { windowKeys };
}) satisfies PageServerLoad;