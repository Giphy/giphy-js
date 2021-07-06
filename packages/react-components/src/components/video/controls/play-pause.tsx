import styled from '@emotion/styled'
import React from 'react'

const PlaySVG = styled.svg`
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.33);
    display: block;
    position: relative;
    transition: box-shadow 0.2s ease-out;
    path {
        transition: all 0.2s ease-out;
    }
`
export const PlayPauseSize = 38
export const PlayIcon = ({ size = PlayPauseSize }) => (
    <PlaySVG height={size} viewBox="0 0 50 50" width={size} xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path
                d="M15.836 10.842c.135 0 .27.04.404.12L33.444 22.86c.107.087.161.19.161.311 0 .12-.054.224-.161.31-11.649 7.575-17.528 11.362-17.64 11.362a.632.632 0 0 1-.41-.13l.025-23.75a.804.804 0 0 1 .417-.12z"
                data-playicon
                fill="#fff"
            />
        </g>
    </PlaySVG>
)

export const PauseIcon = ({ size = PlayPauseSize }) => (
    <svg height={size} viewBox="0 0 50 50" width={size} xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="m0 0h50v50h-50z" />
            <g fill="#fff" transform="translate(10 10)">
                <path d="m.208696 29.208696v-28c0-.55228475.44771525-1 1-1h9.25c.5522847 0 1 .44771525 1 1v28c0 .5522847-.4477153 1-1 1h-9.25c-.55228475 0-1-.4477153-1-1z" />
                <path d="m18.958696 29.208696v-28c0-.55228475.4477153-1 1-1h9.25c.5522847 0 1 .44771525 1 1v28c0 .5522847-.4477153 1-1 1h-9.25c-.5522847 0-1-.4477153-1-1z" />
            </g>
        </g>
    </svg>
)
