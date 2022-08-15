import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { giphyBlack, giphyCharcoal, giphyIndigo, giphyLightGrey, giphyWhite } from '@giphy/js-brand'
import React, { useContext, useEffect, useRef, useState } from 'react'
import useDebounce from 'react-use/lib/useDebounce'
import CancelIcon from './cancel-icon'
import { SearchContext, _SearchContext } from './context'
import SearchBarChannel from './search-bar-channel'
import SearchButton from './search-button'
import { getSize } from './theme'

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
    searchDebounce?: number
    initialTerm?: string
    onEnter?: (term: string) => void
}

const Container = styled.div`
    display: flex;
    background: white;
    align-items: center;
    border-radius: 4px;
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

const SearchBar = ({
    className,
    placeholder = `Search GIPHY`,
    clear = false,
    autoFocus,
    searchDebounce = SEARCH_DEBOUNCE,
    onEnter,
}: Props) => {
    const { activeChannel, setActiveChannel, term, setChannels } = useContext(SearchContext)
    const { setIsFocused, _inputValOverride, _setSearch } = useContext(_SearchContext)

    // the input val
    const [val, setVal] = useState<string>(term)

    // set the term when it changes after searchDebounce
    useDebounce(() => _setSearch(val), searchDebounce, [val])

    // used only to focus the input
    const inputRef = useRef<HTMLInputElement | null>(null)

    // we'll use this to see when we went from no channel to channel
    const previousActiveChannel = usePrevious(activeChannel)

    const [isCleared, setCleared] = useState(clear)

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
            if (val === ' ') {
                // this doesn't come from a keystroke
                setVal('')
            } else {
                setVal(val.replace(/@?\w*\s?/, ''))
            }
        }
    }, [val, activeChannel, previousActiveChannel])

    useEffect(() => {
        setCleared(clear)
    }, [clear])
    // something is setting the input value
    useEffect(() => {
        setVal(_inputValOverride)
    }, [_inputValOverride, setVal])

    // key ups to clear the active channel
    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.keyCode || e.key
        switch (key) {
            case 27: // esc
            case `Escape`: // esc
                setActiveChannel(undefined)
                setChannels([])
                break
            case 13: // esc
            case `Enter`: // esc
                onEnter?.(val)
                break
            default:
                break
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.keyCode || e.key
        switch (key) {
            case 8: // backspace
            case 'Backspace':
                if (val === '') {
                    setActiveChannel(undefined)
                    setChannels([])
                }
                break
            default:
                break
        }
    }

    return (
        <Container className={[SearchBar.className, className].join(' ')}>
            <SearchBarChannel />
            <Input
                isUsernameSearch={term.indexOf('@') === 0}
                onChange={({ target: { value } }) => {
                    if (!isCleared || value !== '') {
                        setCleared(false)
                        setVal(value)
                    }
                }}
                onFocus={() => {
                    setIsFocused(true)
                }}
                onBlur={() => {
                    setIsFocused(false)
                }}
                value={isCleared ? '' : val}
                placeholder={activeChannel ? `Search ${activeChannel.display_name}` : placeholder}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                ref={inputRef}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown}
            />
            <CancelIcon setCleared={() => setVal('')} />
            <SearchButton />
        </Container>
    )
}

SearchBar.className = 'giphy-search-bar'

export default SearchBar
