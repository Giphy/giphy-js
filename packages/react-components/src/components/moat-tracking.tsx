import { constructMoatData } from '@giphy/js-util'
import React from 'react'

type Props = { bottleData: any }

export const MoatTracking = ({ bottleData }: Props) => {
    const moatCompatibleData = constructMoatData(bottleData as any)
    if (moatCompatibleData) {
        const partnerId = 'giphyjsdisplay626459778035'
        const kvPairs = Object.entries(moatCompatibleData).map(([key, value]) => `${key}=${value}`)
        // Constructing the URL with macros replaced by their values
        const url = `https://z.moatads.com/${partnerId}/moatad.js#${kvPairs.join('&')}`
        const noscriptClassName = `MOAT-${partnerId}?${kvPairs.join('&amp:')}`
        return (
            <>
                <noscript className={noscriptClassName}></noscript>
                <script src={url} type="text/javascript"></script>
            </>
        )
    }
    return null
}

export default MoatTracking
