import { GiphyFetch } from '@giphy/js-fetch-api'
const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return gf.trending({ offset: 0, limit: 10 })
}
