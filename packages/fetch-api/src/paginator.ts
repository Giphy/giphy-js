import { IGif } from '@giphy/js-types'
import { GifsResult } from './result-types'

/**
 * @hidden
 */
export const gifPaginator = (fetchGifs: (offset: number) => Promise<GifsResult>) => {
    const gifs: IGif[] = []
    // for deduping
    const gifIds: (string | number)[] = []
    let offset = 0
    let isDoneFetching = false
    return async () => {
        if (isDoneFetching) {
            return gifs
        }
        const result = await fetchGifs(offset)
        const { pagination, data: newGifs } = result
        offset = pagination.count + pagination.offset
        isDoneFetching = offset === pagination.total_count
        newGifs.forEach(gif => {
            const { id } = gif
            if (!gifIds.includes(id)) {
                // add gifs and gifIds
                gifs.push(gif)
                gifIds.push(id)
            }
        })
        return [...gifs]
    }
}
