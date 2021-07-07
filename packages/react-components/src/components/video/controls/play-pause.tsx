import React from 'react'

export const PlayPauseSize = 25
export const PlayIcon = ({ size = PlayPauseSize }) => (
    <svg height={size} viewBox="15.39 10.84 18.21 24" width={size} xmlns="http://www.w3.org/2000/svg">
        <g fillRule="evenodd" fill="none">
            <path
                fill="#fff"
                d="M15.836 10.842c.135 0 .27.04.404.12L33.444 22.86c.107.087.161.19.161.311 0 .12-.054.224-.161.31-11.649 7.575-17.528 11.362-17.64 11.362a.632.632 0 0 1-.41-.13l.025-23.75a.804.804 0 0 1 .417-.12z"
            ></path>
        </g>
    </svg>
)

export const PauseIcon = ({ size = PlayPauseSize }) => (
    <svg height={size} viewBox="0.92 0.92 23.54 24" width={size} xmlns="http://www.w3.org/2000/svg">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Group" transform="translate(0.916948, 0.916948)" fill="#FFFFFF" fillRule="nonzero">
                <path
                    d="M0,23.2 L0,0.8 C0,0.3581722 0.3581722,0 0.8,0 L8.2,0 C8.64182776,0 9,0.3581722 9,0.8 L9,23.2 C9,23.6418278 8.64182776,24 8.2,24 L0.8,24 C0.3581722,24 0,23.6418278 0,23.2 Z"
                    id="Path"
                />
                <path
                    d="M14.5408163,23.2 L14.5408163,0.8 C14.5408163,0.3581722 14.8989886,0 15.3408163,0 L22.7408163,0 C23.1826441,0 23.5408163,0.3581722 23.5408163,0.8 L23.5408163,23.2 C23.5408163,23.6418278 23.1826441,24 22.7408163,24 L15.3408163,24 C14.8989886,24 14.5408163,23.6418278 14.5408163,23.2 Z"
                    id="Path"
                />
            </g>
        </g>
    </svg>
)
