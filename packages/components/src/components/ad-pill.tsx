import { h } from 'preact'
import { css, cx } from 'emotion'
import { adPill } from '@giphy/js-brand'

const adPillPosition = css`
    position: absolute;
    bottom: 5px;
    left: 5px;
    transition: opacity 0.33s ease-in-out;
`

const adPillClass = cx(adPill, adPillPosition)
type Props = {
    bottleData?: object
    isHovered: boolean
}

const AdPill = ({ bottleData, isHovered }: Props) => {
    const renderAdPill = bottleData && Object.keys(bottleData).length > 0
    return renderAdPill ? <div className={adPillClass} style={{ opacity: isHovered ? 0 : 1 }} /> : null
}

export default AdPill
