import { IGif } from '@giphy/js-types'

export type onFetch = (gifs: IGif[]) => void
export type onPage = (page: number) => void
export type onFetchError = (e: Error) => void

export interface EventProps {
    onFetch?: onFetch // used by fetch client
    onPage?: onPage // used by fetch client
    onGifsFetched?: onFetch // used by components
    onFetchError?: onFetchError // used by components?
}
