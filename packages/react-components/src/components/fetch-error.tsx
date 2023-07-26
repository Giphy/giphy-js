import { giphyBlue, giphyLightGrey } from '@giphy/colors'
import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'

const Message = styled.div`
    color: ${giphyLightGrey};
    display: flex;
    justify-content: center;
    margin: 30px 0;
    font-family: interface, Helvetica Neue, helvetica, sans-serif;
    font-size: 16px;
    font-weight: 600;
    a {
        color: ${giphyBlue};
        cursor: pointer;
        &:hover {
            color: white;
        }
    }
`
type Props = { onClick: (e: SyntheticEvent<HTMLElement, Event>) => void }
const FetchError = ({ onClick }: Props) => (
    <Message>
        Error loading GIFs.&nbsp;<a onClick={onClick}>Try again?</a>
    </Message>
)
export default FetchError
