import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useContext } from 'react'
import { SearchContext } from './context'

const Icon = styled.svg`
    position: relative;
    right: 10px;
    margin-left: 5px;
    cursor: pointer;
    ${(props) =>
        props.theme.hideCancelButton &&
        css`
            display: none;
        `};
`

type Props = { width?: number; height?: number; setCleared: (clear: boolean) => void }

const CancelIcon = ({ width = 17, height = 17, setCleared }: Props) => {
    const { term, setActiveChannel, activeChannel } = useContext(SearchContext)
    return term || activeChannel ? (
        <Icon
            className={CancelIcon.className}
            width={width}
            height={height}
            viewBox="0 0 17 17"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setCleared(true)
                setActiveChannel(undefined)
            }}
        >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.582730817">
                <g transform="translate(-300.000000, -150.000000)" fill="#8E8E93" fillRule="nonzero">
                    <g transform="translate(0.000000, 135.000000)">
                        <g>
                            <g>
                                <g transform="translate(11.000000, 13.000000)">
                                    <g transform="translate(289.000000, 2.000000)">
                                        <path
                                            d="M8.5,0 C3.805875,0 0,3.805875 0,8.5 C0,13.194125 3.805875,17 8.5,17 C13.194125,17 17,13.194125 17,8.5 C17,3.805875 13.194125,0 8.5,0 Z M9.50158333,8.5 C9.50158333,8.5 11.7250417,10.7234583 11.834125,10.8325417 C12.1110833,11.1095 12.1110833,11.557875 11.834125,11.834125 C11.5571667,12.1110833 11.1087917,12.1110833 10.8325417,11.834125 C10.7234583,11.72575 8.5,9.50158333 8.5,9.50158333 C8.5,9.50158333 6.27654167,11.7250417 6.16745833,11.834125 C5.8905,12.1110833 5.442125,12.1110833 5.165875,11.834125 C4.88891667,11.5571667 4.88891667,11.1087917 5.165875,10.8325417 C5.27425,10.7234583 7.49841667,8.5 7.49841667,8.5 C7.49841667,8.5 5.27495833,6.27654167 5.165875,6.16745833 C4.88891667,5.8905 4.88891667,5.442125 5.165875,5.165875 C5.44283333,4.88891667 5.89120833,4.88891667 6.16745833,5.165875 C6.27654167,5.27425 8.5,7.49841667 8.5,7.49841667 C8.5,7.49841667 10.7234583,5.27495833 10.8325417,5.165875 C11.1095,4.88891667 11.557875,4.88891667 11.834125,5.165875 C12.1110833,5.44283333 12.1110833,5.89120833 11.834125,6.16745833 C11.72575,6.27654167 9.50158333,8.5 9.50158333,8.5 Z"
                                            opacity="0.75"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </Icon>
    ) : null
}
CancelIcon.className = 'giphy-search-bar-cancel'
export default CancelIcon
