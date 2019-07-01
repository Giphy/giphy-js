import { IGif } from '@giphy/js-types'
import { GifsResult } from './result-types'

/**
 * @hidden
 */
export const gifPaginator = (fetchGifs: (offset: number) => Promise<GifsResult>) => {
    let gifs: IGif[] = []
    // for deduping
    let gifIds: (string | number)[] = []
    let offset = 0
    return async () => {
        const result = await fetchGifs(offset)
        const { pagination, data: newGifs } = result
        offset = pagination.count + pagination.offset
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
