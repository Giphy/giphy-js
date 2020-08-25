import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { giphyIndigo, giphyLightGrey } from '@giphy/js-brand'
import React, { useContext, useEffect, useRef, useState } from 'react'
import useDebounce from 'react-use/lib/useDebounce'
import { SearchContext } from './context'
import SearchBarChannel from './search-bar-channel'
import SearchButton from './search-button'
import { getSize, SearchTheme } from './theme'

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
}

const SearchBar = ({ className, placeholder = 'Search GIPHY', clear = false }: Props) => {
    const { setSearch, activeChannel, setActiveChannel, term: hoistedStateTerm } = useContext(SearchContext)

    // debounce local input
    const [term, setDebouncedInput] = useState<string>(hoistedStateTerm)

    // used to see if the last term was a '' before clearing
    const lastTerm = usePrevious(term)
    // set the term when it changes
    useDebounce(() => setSearch?.(term, usernameText), SEARCH_DEBOUNCE, [term])

    // used only to focus the input
    const inputRef = useRef<HTMLInputElement | null>(null)

    // we'll use this to see when we went from no channel to channel
    const previousActiveChannel = usePrevious(activeChannel)

    // the current username text
    const [usernameText, setUsernameText] = useState<string>('')

    // manage username inputs
    useEffect(() => {
        if (term && term.indexOf('@') === 0) {
            setUsernameText(term.slice(1).split(' ')[0])
        } else {
            // clear channel
            setUsernameText('')
        }
        // if we know have a channel, focus and clear the input
        // so the user can search the channel
        if (activeChannel && !previousActiveChannel) {
            inputRef.current?.focus()
            setDebouncedInput('')
        }
    }, [term, activeChannel])

    // a pill could have been clicked, update our local term state
    useEffect(() => {
        setDebouncedInput(hoistedStateTerm)
    }, [hoistedStateTerm])

    const [isCleared, setCleared] = useState(clear)

    useEffect(() => {
        setCleared(clear)
    }, [clear])

    // key ups to clear the active channel
    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case 8: // backspace
                if (lastTerm === '') {
                    setActiveChannel(undefined)
                }
                break
            case 27: // esc
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
                isUsernameSearch={!!usernameText}
                onChange={({ target: { value } }) => {
                    if (!isCleared || value !== '') {
                        setCleared(false)
                        setDebouncedInput(value)
                    }
                }}
                value={isCleared ? '' : term}
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

const Container = styled.div`
    display: flex;
    background: white;
    ${(props) => getSize(props.theme as SearchTheme)}
`

const Input = styled.input<{ isUsernameSearch: boolean }>`
    box-sizing: border-box;
    border: 0;
    appearance: none;
    font-weight: normal;
    outline: 0;
    font-size: 15px;
    padding: 0 0 0 15px;
    border-radius: 0;
    &::placeholder {
        color: ${giphyLightGrey};
    }
    min-width: 150px;
    flex: 1;
    ${(props) =>
        props.isUsernameSearch &&
        css`
            color: ${giphyIndigo};
        `}
`

SearchBar.className = 'giphy-search-bar'

export default SearchBar
