import React from 'react'
import { constructMoatData } from '@giphy/js-util'

type Props = { bottleData: any }

export const MoatTracking = ({ bottleData }: Props) => {
    const moatCompatibleData = constructMoatData(bottleData as any)
    // Constructing the URL with macros replaced by their values
    const url = `https://z.moatads.com/giphyjsdisplay626459778035/moatad.js#${Object.entries(moatCompatibleData)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
    const scriptTag = <script src={url} type="text/javascript"></script>
    return scriptTag
}

export default MoatTracking
