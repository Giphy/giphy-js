import { IGif } from '@giphy/js-types'
import { GifsResult } from './result-types'

export const invisibleGifsFlag = Symbol('has inivisible gifs')
/**
 * @hidden
 */
export const gifPaginator = (fetchGifs: (offset: number) => Promise<GifsResult>, initialGifs: IGif[] = []) => {
    let gifs: IGif[] = [...initialGifs]
    // for deduping
    let gifIds: (string | number)[] = initialGifs.map((g) => g.id)
    let offset = initialGifs.length
    let isDoneFetching = false
    return async (externalGifs?: IGif[]) => {
        // gifs can be edited and tracked after they're loaded
        // externalGifs is a hoisted gif state
        if (externalGifs) {
            gifs = externalGifs
            gifIds = externalGifs.map((g) => g.id)
        }
        if (isDoneFetching) {
            return gifs
        }
        const result = await fetchGifs(offset)
        const { pagination, data: newGifs } = result

        // on the next request, this will be the offset
        offset = pagination.count + pagination.offset

        // total_count is not often known, but if it is, it's a good indicator
        // that we're done fetching, the next request will be skipped
        isDoneFetching = offset === pagination.total_count

        newGifs.forEach((gif) => {
            const { id } = gif
            if (!gifIds.includes(id)) {
                // add gifs and gifIds
                gifs.push(gif)
                gifIds.push(id)
            }
        })

        const g = [...gifs]
        // @ts-expect-error a hidden flag set by a fetch gifs function
        if (pagination.hasMoreGifs) {
            // @ts-expect-error a hidden flag just for the layout
            // components to use. it lets them know that even though
            // they fetched the same number of gifs twice,
            // which normally means they should stop,
            // try again with the new offset specified in pagination
            g.skipCountCheck = invisibleGifsFlag
        }
        return g
    }
}
