import { IGif, IProfileUser } from '@giphy/js-types'
import { css, cx } from '@emotion/css'
import { h } from 'preact'
import Avatar from './avatar'
import VerifiedBadge from './verified-badge'

const containerCss = css`
    display: flex;
    align-items: center;
    font-family: interface, helvetica, arial;
`
const avatarCss = css`
    flex-shrink: 0;
`
const userName = css`
    color: white;
    font-size: 17px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
`
const verifiedBadge = css`
    margin: 0 4px;
    flex-shrink: 0;
`
type Props = { gif: IGif; className?: string; onClick?: (gif: IGif) => void }
const Attribution = ({ gif, className, onClick }: Props) => {
    const { user } = gif
    if (!user?.username && !user?.display_name) {
        return null
    }
    const { display_name, username } = user
    return (
        <div
            className={cx(containerCss, Attribution.className, className)}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onClick) {
                    onClick(gif)
                } else {
                    const url = (user as IProfileUser).profile_url
                    if (url) window.open(url, '_blank')
                }
            }}
        >
            <Avatar user={user} className={avatarCss} />
            <div className={userName}>{display_name || `@${username}`}</div>
            {user.is_verified ? <VerifiedBadge size={14} className={verifiedBadge} /> : null}
        </div>
    )
}
Attribution.className = 'giphy-attribution'
export default Attribution
