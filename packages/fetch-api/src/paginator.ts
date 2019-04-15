import { IGif } from '@giphy/js-types'
import { GifsResult } from './result-types'

export const gifPaginator = (fetchGifs: (offset: number) => Promise<GifsResult>) => {
    let gifs: IGif[] = []
    let offset = 0
    return async () => {
        const result = await fetchGifs(offset)
        const { pagination } = result
        offset = pagination.count + pagination.offset
        gifs = [...gifs, ...result.data]
        return gifs
    }
}
