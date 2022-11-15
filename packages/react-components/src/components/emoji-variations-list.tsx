import React, { ElementType, useEffect } from 'react'
import styled from '@emotion/styled'
import useAsyncFn from 'react-use/lib/useAsyncFn'
import useLatest from 'react-use/lib/useLatest'
import { giphyDarkGrey, giphyCharcoal } from '@giphy/js-brand'
import { getGifWidth } from '@giphy/js-util'
import type { GifID, IGif, IUser } from '@giphy/js-types'
import type { NonPaginatedGifsResult } from '@giphy/js-fetch-api'

import FetchError from './fetch-error'
import Gif, { EventProps } from './gif'
import type { GifOverlayProps } from './types'

export type EmojiVariationsListProps = {
    backgroundColor?: string
    dividerColor?: string
    fetchVariations: (gifId: GifID) => Promise<NonPaginatedGifsResult>
    gif: IGif
    gifHeight: number
    GifProps?: Partial<React.ComponentProps<typeof Gif>>
    gifWidth?: number
    gutter?: number
    hideAttribution?: boolean
    loader?: ElementType
    noLink?: boolean
    onVariationsFetched?: (gifs: IGif[]) => void
    overlay?: ElementType<GifOverlayProps>
    tabIndex?: number
    user?: Partial<IUser>
} & EventProps &
    React.ComponentProps<'div'>

const DEFAULT_BG_COLOR = giphyDarkGrey
const DEFAULT_DIVIDER_COLOR = giphyCharcoal
const DIVIDER_RELATIVE_HEIGHT = 0.75

const Root = styled.div<{ backgroundColor?: string }>`
    align-items: center;
    background-color: ${({ backgroundColor }) => backgroundColor};
    border-radius: 16px;
    display: flex;
    max-width: fit-content;
    overflow: hidden;
    padding: 4px 5px 5px 6px;
`

const VariationsViewport = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    -webkit-overflow-scrolling: touch;
`

const VariationsContainer = styled.div<{ width: number }>`
    display: inline-flex;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
    width: ${({ width }) => `${width}px`};
`

const Divider = styled.div<{ color?: string; gifHeight: number; gutter: number }>`
    background-color: ${({ color }) => color};
    box-sizing: border-box;
    height: ${({ gifHeight }) => `${Math.round(gifHeight * DIVIDER_RELATIVE_HEIGHT)}px`};
    margin: ${({ gutter }) => `0 ${gutter}px`};
    width: 2px;
`

const Emoji = styled(Gif)`
    display: inline-block;
    flex-shrink: 0;
    list-style: none;
    /* make sure gifs are fully visible with a scrollbar */
    margin-bottom: 1px;
    position: relative;

    .${Gif.imgClassName} {
        position: absolute;
        top: 0;
        left: 0;
    }
`

export function EmojiVariationsList(props: EmojiVariationsListProps) {
    const {
        backgroundColor = DEFAULT_BG_COLOR,
        className,
        dividerColor = DEFAULT_DIVIDER_COLOR,
        fetchVariations,
        gif,
        gifHeight,
        GifProps = {},
        gifWidth: gifWidthProp,
        gutter = 6,
        hideAttribution,
        loader: LoaderComponent,
        noLink,
        onGifClick,
        onGifKeyPress,
        onGifRightClick,
        onGifSeen,
        onGifVisible,
        onVariationsFetched,
        overlay,
        tabIndex = 0,
        user,
        ...other
    } = props

    const variationCount = gif.variation_count ?? 0
    const gifWidth = gifWidthProp || getGifWidth(gif, gifHeight)
    const variationsContainerWidth = variationCount * gifWidth + Math.max(0, variationCount - 1) * gutter

    const fetchVariationsRef = useLatest(fetchVariations)
    const onVariationsFetchedRef = useLatest(onVariationsFetched)
    const [variationsState, syncVariations] = useAsyncFn(
        async () => {
            const result = await fetchVariationsRef.current(gif.id)
            const variations = (result?.data ?? []) as IGif[]
            if (onVariationsFetchedRef.current) {
                onVariationsFetchedRef.current(variations)
            }
            return variations
        },
        [gif],
        { loading: true, value: [] }
    )

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        syncVariations()
    }, [syncVariations])

    const emojiCommonProps = {
        backgroundColor: 'transparent',
        height: gifHeight,
        hideAttribution,
        noLink,
        onGifClick,
        onGifKeyPress,
        onGifRightClick,
        onGifSeen,
        onGifVisible,
        overlay,
        tabIndex,
        user,
        width: gifWidth,
        ...GifProps,
    }

    const getVariationsContent = () => {
        if (variationsState.loading) {
            return LoaderComponent ? <LoaderComponent className={EmojiVariationsList.loaderClassName} /> : null
        }
        if (variationsState.error) {
            return <FetchError onClick={syncVariations} />
        }

        return (
            <>
                {(variationsState.value ?? []).map((gif) => (
                    <Emoji {...emojiCommonProps} key={gif.id} gif={gif} />
                ))}
            </>
        )
    }

    return (
        <Root
            backgroundColor={backgroundColor}
            className={[EmojiVariationsList.className, className].join(' ')}
            {...other}
        >
            <Emoji {...emojiCommonProps} gif={gif} />
            {variationCount ? (
                <Divider
                    className={EmojiVariationsList.dividerClassName}
                    color={dividerColor}
                    gifHeight={gifHeight}
                    gutter={gutter}
                />
            ) : null}
            <VariationsViewport className={EmojiVariationsList.variationsViewportClassName}>
                <VariationsContainer
                    className={EmojiVariationsList.variationsContainerClassName}
                    width={variationsContainerWidth}
                >
                    {getVariationsContent()}
                </VariationsContainer>
            </VariationsViewport>
        </Root>
    )
}

EmojiVariationsList.className = 'giphy-emoji-variations-list'
EmojiVariationsList.dividerClassName = 'giphy-emoji-variations-divider'
EmojiVariationsList.loaderClassName = 'giphy-emoji-variations-loader'
EmojiVariationsList.variationsViewportClassName = 'giphy-emoji-variations-viewport'
EmojiVariationsList.variationsContainerClassName = 'giphy-emoji-variations-container'
