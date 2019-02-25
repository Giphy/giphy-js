import { h } from 'preact'
import { css, cx } from 'emotion'
import { adPill } from '@giphy-js/brand'

const adPillPosition = css`
    position: absolute;
    bottom: 5px;
    left: 5px;
`

const adPillClass = cx(adPill, adPillPosition)
type Props = {
    bottle_data?: object
}

const AdPill = ({ bottle_data }: Props) => {
    const renderAdPill = bottle_data && Object.keys(bottle_data).length > 0
    return renderAdPill ? <div class={adPillClass} /> : null
}

export default AdPill
