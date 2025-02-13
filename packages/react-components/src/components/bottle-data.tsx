import { noUUIDRandom } from '@giphy/js-util'
import React, { useEffect, useRef, useState } from 'react'

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
    const processedSrc = useRef(processTag(src))
    const [render, setRender] = useState(false)
    useEffect(() => {
        setRender(true)
    }, [])
    return render ? <img src={processedSrc.current} width={0} height={0} /> : null
}

export default BottleData
