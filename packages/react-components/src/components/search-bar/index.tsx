import { css } from '@emotion/core'
import { giphyBlack, giphyCharcoal, giphyIndigo, giphyLightGrey, giphyWhite } from '@giphy/js-brand'
import React, { useContext, useEffect, useRef, useState } from 'react'
import useDebounce from 'react-use/lib/useDebounce'
import { SearchContext } from './context'
import SearchBarChannel from './search-bar-channel'
import SearchButton from './search-button'
import styled, { getSize } from './theme'

function usePrevious<T>(value: T) {
    const ref = useRef<T>(value)
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

const SEARCH_DEBOUNCE = 500

type Props = {
    className?: string
    placeholder?: string
    // clears the input until the next entry,
    // leaves the term in context unaffected
    clear?: boolean
    autoFocus?: boolean
}

const Container = styled.div`
    display: flex;
    background: white;
    ${(props) => getSize(props.theme)}
`

const Input = styled.input<{ isUsernameSearch: boolean }>`
    background: ${(props) => (props.theme.mode === 'dark' ? giphyCharcoal : giphyWhite)};
    box-sizing: border-box;
    border: 0;
    appearance: none;
    font-weight: normal;
    font-family: interface, Helvetica Neue, helvetica, sans-serif;
    outline: 0;
    font-size: 15px;
    padding: 0 10px;
    border-radius: 0;
    text-overflow: ellipsis;
    color: ${(props) => (props.theme.mode === 'dark' ? giphyWhite : giphyBlack)};
    &::placeholder {
        color: ${(props) => (props.theme.mode === 'dark' ? giphyLightGrey : giphyLightGrey)};
    }
    min-width: 150px;
    flex: 1;
    ${(props) =>
        props.isUsernameSearch &&
        css`
            color: ${giphyIndigo};
        `}
`

const SearchBar = ({ className, placeholder = `Search GIPHY`, clear = false, autoFocus }: Props) => {
    const { setSearch, activeChannel, setActiveChannel, term, channelSearch } = useContext(SearchContext)

    // debounce local input
    const [debouncedTerm, setDebouncedInput] = useState<string>(term)

    // used to see if the last term was a '' before clearing
    const lastTerm = usePrevious(debouncedTerm)
    // set the term when it changes
    useDebounce(() => setSearch(debouncedTerm), SEARCH_DEBOUNCE, [debouncedTerm])

    // used only to focus the input
    const inputRef = useRef<HTMLInputElement | null>(null)

    // we'll use this to see when we went from no channel to channel
    const previousActiveChannel = usePrevious(activeChannel)

    useEffect(() => {
        if (autoFocus) {
            inputRef.current?.focus()
        }
    }, [autoFocus])

    useEffect(() => {
        // if we know have a channel, focus and clear the input
        // so the user can search the channel
        if (activeChannel && !previousActiveChannel) {
            inputRef.current?.focus()
            setDebouncedInput('')
        }
    }, [debouncedTerm, activeChannel, previousActiveChannel])

    // a pill could have been clicked, update our local term state
    useEffect(() => {
        setDebouncedInput(term)
    }, [term])

    const [isCleared, setCleared] = useState(clear)

    useEffect(() => {
        setCleared(clear)
    }, [clear])

    // key ups to clear the active channel
    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.keyCode || e.key
        switch (key) {
            case 8: // backspace
            case 'Backspace':
                if (lastTerm === '') {
                    setActiveChannel(undefined)
                }
                break
            case 27: // esc
            case `Escape`: // esc
                setActiveChannel(undefined)
                break
            default:
                break
        }
    }

    return (
        <Container className={[SearchBar.className, className].join(' ')}>
            <SearchBarChannel />
            <Input
                isUsernameSearch={!!channelSearch}
                onChange={({ target: { value } }) => {
                    if (!isCleared || value !== '') {
                        setCleared(false)
                        setDebouncedInput(value)
                    }
                }}
                value={isCleared ? '' : debouncedTerm}
                placeholder={activeChannel ? `Search ${activeChannel.display_name}` : placeholder}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                ref={inputRef}
                onKeyUp={onKeyUp}
            />
            <SearchButton />
        </Container>
    )
}

SearchBar.className = 'giphy-search-bar'

export default SearchBar
