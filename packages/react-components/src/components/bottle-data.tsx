import { noUUIDRandom } from '@giphy/js-util'
import React from 'react'

function processTag(tag: string) {
    tag = tag.replace(`%%CACHEBUSTER%%`, noUUIDRandom())
    tag = tag.replace('%%TIMESTAMP%%', `${Date.now()}`)
    tag = tag.replace('%%APPBUNDLE%%', `web`)
    if (typeof window !== 'undefined') {
        tag = tag.replace('%%APP_WINDOW_SIZE%%', `${window.innerWidth},${window.innerHeight}`)
        tag = tag.replace('%%DEVICE_LANGUAGE%%', `${navigator.language}`)
    }
    return tag
}
function BottleData({ src }: { src: string }) {
    return <img src={processTag(src)} />
}

export default BottleData
