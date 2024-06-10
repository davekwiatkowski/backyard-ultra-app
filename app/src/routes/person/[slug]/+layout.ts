import type { IRanking } from '../../../types/IRanking';
import type { LayoutLoad } from './$types';

export const load = (async ({ params }) => {
    return { currentPersonId: params.slug };
}) satisfies LayoutLoad;