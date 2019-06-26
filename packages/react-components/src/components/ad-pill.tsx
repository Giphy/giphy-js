import React from 'react'
import { css, cx } from 'emotion'
import { adPill } from '@giphy/js-brand'

const adPillPosition = css`
    position: absolute;
    bottom: 5px;
    left: 5px;
`

const adPillClass = cx(adPill, adPillPosition)
type Props = {
    bottleData?: object
}

const AdPill = ({ bottleData }: Props) => {
    const renderAdPill = bottleData && Object.keys(bottleData).length > 0
    return renderAdPill ? <div className={adPillClass} /> : null
}

export default AdPill
