import { IGif } from '@giphy/js-types'
import { GifsResult } from './result-types'

/**
 * @hidden
 */
export const gifPaginator = (fetchGifs: (offset: number) => Promise<GifsResult>, initialGifs: IGif[] = []) => {
    const gifs: IGif[] = [...initialGifs]
    // for deduping
    const gifIds: (string | number)[] = initialGifs.map(g => g.id)
    let offset = initialGifs.length
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
