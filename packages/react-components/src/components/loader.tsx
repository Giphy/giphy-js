'use client'
import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from '@giphy/colors'
import React from 'react'
import styled, { keyframes } from 'styled-components'

const bouncer = keyframes`
     to {
    transform: scale(1.75) translateY(-20px);
  }
`
const loaderHeight = 52
const Container = styled.div`
    display: flex;
    align-items: center;
    height: ${loaderHeight}px;
    margin: 0 auto;
    text-align: center;
    justify-content: center;
    animation: pulse 0.8s ease-in-out 0s infinite alternate backwards;
`

const Dot = styled.div<{ $color: string; $delay: string }>`
    display: inline-block;
    height: 10px;
    width: 10px;
    margin: ${loaderHeight}px 10px 10px 10px;
    position: relative;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
    animation: ${bouncer} cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.75s infinite alternate;
    background: ${(props) => props.$color};
    animation-delay: ${(props) => props.$delay};
`

const Loader = ({ className = '' }: { className?: string }) => (
    <Container className={className}>
        <Dot $color={giphyGreen} $delay="0" />
        <Dot $color={giphyBlue} $delay=".1s" />
        <Dot $color={giphyPurple} $delay=".2s" />
        <Dot $color={giphyRed} $delay=".3s" />
        <Dot $color={giphyYellow} $delay=".4s" />
    </Container>
)

export default Loader
