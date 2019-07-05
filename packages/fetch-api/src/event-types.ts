import { IGif } from '@giphy/js-types'

export interface EventTypes {
    onGifsFetched?: (gifs: IGif[]) => void
    onFetchError?: (e: Error) => void
}
