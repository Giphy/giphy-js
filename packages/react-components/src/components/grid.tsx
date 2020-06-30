import { gifPaginator, GifsResult } from '@giphy/js-fetch-api'
import { IGif, IUser } from '@giphy/js-types'
import { getGifHeight } from '@giphy/js-util'
import React, { ReactType, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { debounce } from 'throttle-debounce'
import Observer from '../util/observer'
import FetchError from './fetch-error'
import Gif, { EventProps, GifOverlayProps } from './gif'
import Loader from './loader'

// PROTOTYPE
// https://tobiasahlin.com/blog/masonry-with-css/
// fails when columns grow too long and the items
// are supposed to shuffle (they don't but if they did, it wouldn't work)

function chunk<T>(a: T[], l: number): T[][] {
    return a.length === 0 ? [] : [a.slice(0, l)].concat(chunk(a.slice(l), l))
}

const LoaderStyled = styled(Loader)<{ isFirstLoad: boolean }>`
    ${props =>
        props.isFirstLoad &&
        css`
            opacity: 0;
        `}
`

const Container = styled.div<{ width: number; gifWidth: number; gutter: number }>`
    display: flex;
    flex-flow: column wrap;
    align-content: space-between;
    width: ${props => props.width}px;
    :before,
    :after {
        content: '';
        flex-basis: 100%;
        width: 0;
        order: 2;
    }
    ${'.' + Gif.className} {
        width: ${props => props.gifWidth}px;
        margin-bottom: ${props => props.gutter}px;
    }
    /* Re-order items into rows TODO HARD CODED*/
    ${'.' + Gif.className}:nth-child(3n+1) {
        order: 1;
    }
    ${'.' + Gif.className}:nth-child(3n+2) {
        order: 2;
    }
    ${'.' + Gif.className}:nth-child(3n) {
        order: 3;
    }
`

type Props = {
    className?: string
    width: number
    user?: Partial<IUser>
    columns: number
    gutter: number
    fetchGifs: (offset: number) => Promise<GifsResult>
    onGifsFetched?: (gifs: IGif[]) => void
    onGifsFetchError?: (e: Error) => void
    overlay?: ReactType<GifOverlayProps>
    hideAttribution?: boolean
    noResultsMessage?: string | JSX.Element
    initialGifs?: IGif[]
} & EventProps

const Grid = ({
    initialGifs = [],
    fetchGifs,
    onGifVisible,
    onGifRightClick,
    className,
    onGifSeen,
    onGifClick,
    user = {},
    overlay,
    hideAttribution,
    noResultsMessage,
    width,
    columns,
    gutter = 30,
    onGifsFetchError,
    onGifsFetched,
}: Props) => {
    const [gifs, setGifs] = useState(initialGifs)
    const paginator = useRef(gifPaginator(fetchGifs))
    const [isLoaderVisible, setLoaderVisible] = useState(false)
    const [isDoneFetching, setDoneFetching] = useState(false)
    const [isFetching, setFetching] = useState(false)
    const [isError, setError] = useState(false)
    const gutterOffset = gutter * (columns - 1)
    const gifWidth = Math.floor((width - gutterOffset) / columns)
    const showLoader = fetchGifs && !isDoneFetching
    const isFirstLoad = gifs.length === 0
    const unmounted = useRef(false)
    useEffect(() => {
        return () => {
            unmounted.current = true
        }
    }, [])

    const onFetch = useRef(debounce(Grid.fetchDebounce, async () => {}))
    onFetch.current = debounce(Grid.fetchDebounce, async () => {
        if (unmounted.current) return
        if (!isFetching && isLoaderVisible) {
            setFetching(true)
            setError(false)
            let nextGifs
            try {
                nextGifs = await paginator.current()
            } catch (error) {
                setFetching(true)
                setError(true)
                onGifsFetchError?.(error)
            }
            if (nextGifs) {
                // if we've just fetched and we don't have
                // any more gifs, we're done fetching
                if (gifs.length === nextGifs.length) {
                    setDoneFetching(true)
                } else {
                    setGifs(nextGifs)
                    setFetching(false)
                    onGifsFetched?.(nextGifs)
                    onFetch.current()
                }
            }
        }
    })

    const onLoaderVisible = (isVisible: boolean) => {
        if (unmounted.current) return
        setLoaderVisible(isVisible)
    }

    useEffect(() => {
        onFetch.current()
    }, [])
    useEffect(() => {
        if (isLoaderVisible) {
            onFetch.current()
        }
    }, [isLoaderVisible])

    const tallestCollumn = useMemo(() => {
        // TODO this is where it falls apart,
        // I can't actuall know what's in each row
        // and we need to measure the height so that's it
        const rows = chunk<IGif>(gifs, 3)
        let result = 0
        const columns: IGif[][] = []
        rows.forEach(gifs => {
            gifs.forEach((gif, index: number) => {
                columns[index] = [...(columns[index] || []), gif]
            })
        })
        columns.forEach(gifs => {
            const test = gifs.reduce((acc, gif) => {
                return acc + getGifHeight(gif, gifWidth) + gutter + 2
            }, 0)
            if (test > result) result = test
        })
        return result
    }, [gifs, columns])

    return (
        <>
            <Container
                className={className}
                style={{ height: tallestCollumn }}
                width={width}
                gutter={gutter}
                gifWidth={gifWidth}
            >
                {gifs.map(gif => (
                    <Gif
                        gif={gif}
                        key={gif.id}
                        width={gifWidth}
                        onGifClick={onGifClick}
                        onGifSeen={onGifSeen}
                        onGifVisible={onGifVisible}
                        onGifRightClick={onGifRightClick}
                        user={user}
                        overlay={overlay}
                        hideAttribution={hideAttribution}
                    />
                ))}
                {!showLoader && gifs.length === 0 && noResultsMessage}
            </Container>
            {isError ? (
                <FetchError onClick={onFetch.current} />
            ) : (
                showLoader && (
                    <Observer onVisibleChange={onLoaderVisible}>
                        <LoaderStyled isFirstLoad={isFirstLoad} className={Grid.loaderClassName} />
                    </Observer>
                )
            )}
        </>
    )
}

Grid.className = 'giphy-grid'
Grid.loaderClassName = 'loader'
Grid.fetchDebounce = 1000

export default Grid
