import { giphyDarkCharcoal, giphyLightestGrey } from '@giphy/js-brand'
import { css, cx, keyframes } from 'emotion'
import React, { useContext } from 'react'
import Avatar from '../attribution/avatar'
import VerifiedBadge from '../attribution/verified-badge'
import { SearchContext } from './context'

const channelMargin = 6

const usernameCss = css`
    background: white;
    display: flex;
    align-items: center;
    padding-left: ${channelMargin}px;
`

const usernamePillCss = css`
    background: ${giphyLightestGrey};
    display: flex;
    padding: 0 4px;
    color: ${giphyDarkCharcoal};
    font-family: interface, Helvetica Neue, helvetica, sans-serif;
    font-weight: 600;
    font-size: 12px;
    align-items: center;
`

type Props = {
    className?: string
    height: number
}

const SearchBarChannel = ({ className = '', height }: Props) => {
    const { activeChannel } = useContext(SearchContext)
    const h = height - channelMargin * 2
    const animateAvatar = keyframes`
        to {
            width: ${h}px;
        }
    `
    return activeChannel ? (
        <div className={cx(usernameCss, className)}>
            <Avatar
                user={activeChannel.user}
                className={css`
                    height: ${h}px;
                    margin: 0;
                    width: 0;
                    animation: ${animateAvatar} 100ms ease-in-out forwards;
                `}
            />
            <div
                key={activeChannel.id}
                className={cx(
                    usernamePillCss,
                    css`
                        height: ${h}px;
                    `
                )}
            >
                <div>@{activeChannel.user.username}</div>
                {activeChannel.user.is_verified && <VerifiedBadge size={14} />}
            </div>
        </div>
    ) : null
}
export default SearchBarChannel
