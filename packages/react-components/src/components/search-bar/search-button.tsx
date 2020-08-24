import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import useThrottle from 'react-use/lib/useThrottle'
import SearchIconSDK from './search-icon'

const time = '2s'
const purp = '#9933FF'
const pink = '#FF6666'
const strongEasing = 'cubic-bezier(0.920, 0.240, 0.185, 0.730)'

const searchFx = keyframes`
    0% {
      transform: rotate(34deg) translate(-10px, 80px);
    };
    
    100% {
      transform: rotate(34deg) translate(-10px, -20px);
    }
`
const plus = keyframes`
    0% { 
      transform: translate(0px, 0px);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(10px, -17px);
      opacity: 0;
    }
`
const gradientFade = keyframes`
    0% {
      opacity: 0;
      background-position: 0% 100%;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      background-position: 100% 0%;
    }
`

const Container = styled.div<{ size: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    @media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
        display: none;
    }
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
`

const GradientBox = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(45deg, ${purp} 0%, ${pink} 100%);
    &:before {
        animation: ${gradientFade} ${time} linear 0s infinite;
        background-image: linear-gradient(45deg, ${purp} 0%, ${pink} 50%, ${purp} 100%);
        background-size: 400%;
        background-position: 0% 100%;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
`

const Fx = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    &::after {
        content: '+';
        color: white;
        font-family: 'SS Standard';
        font-size: 8px;
        position: absolute;
        top: 65%;
        left: 66%;
        animation: ${plus} 1s ${strongEasing} 0s 1 forwards;
    }
`

const Scanner = styled.div`
    position: absolute;
    width: 200%;
    height: 20px;
    background: rgba(255, 255, 255, 0.5);
    transform: rotate(34deg) translate(-10px, -20px);
    animation: ${searchFx} 1s ${strongEasing} 0s 1;
    filter: blur(1px);
`

const SearchIcon = styled(SearchIconSDK)`
    z-index: 1;
    display: flex;
`

type Props = {
    // onClick: () => void
    isFetching?: boolean
    size?: number
}
const SearchButton = ({ isFetching, size = 40 }: Props) => {
    // let the animation run by throttling isFetching
    const throttledFetch = useThrottle(isFetching, 1000)
    return (
        <Container size={size}>
            <GradientBox />
            <SearchIcon />
            {throttledFetch && (
                <Fx>
                    <Scanner />
                </Fx>
            )}
        </Container>
    )
}

export default SearchButton
