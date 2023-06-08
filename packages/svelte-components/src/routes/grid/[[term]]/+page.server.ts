import { GiphyFetch } from '@giphy/js-fetch-api'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

import type { PageServerLoad } from './$types.js'

export const load = (async ({ params }) => {
    const term = params.term || 'tacos'
    return {
        gifs: (await gf.search(term, { offset: 0, limit: 10 })).data,
        term,
    }
}) satisfies PageServerLoad
