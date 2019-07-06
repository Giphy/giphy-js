import { IGif } from '@giphy/js-types'
import { GifsResult } from './result-types'
import { onFetch, onPage } from './event-types'

/**
 * @hidden
 */
export const gifPaginator = (
{
    fetchGifs,
    onFetch,
    onPage
}: {
    fetchGifs: (offset: number) => Promise<GifsResult>
    onFetch?: onFetch
    onPage?: onPage
}) => {
    let gifs: IGif[] = []
    // for deduping
    let gifIds: (string | number)[] = []
    let offset = 0
    let page = 0
    return async () => {
        const result = await fetchGifs(offset)
        const { pagination, data: newGifs } = result
        offset = pagination.count + pagination.offset
        page += 1
        newGifs.forEach(gif => {
            const { id } = gif
            if (!gifIds.includes(id)) {
                // add gifs and gifIds
                gifs.push(gif)
                gifIds.push(id)
            }
        })
        if (onFetch) onFetch(newGifs)
        if (onPage) onPage(page)
        return [...gifs]
    }
}
