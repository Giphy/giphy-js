import { noUUIDRandom } from '@giphy/js-util'
import React, { useRef, useLayoutEffect } from 'react'

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
/**
 * Execute a script tag in a React component.
 * https://macarthur.me/posts/script-tags-in-react/
 */
function BottleData({ markup }: { markup: string }) {
    const elRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!elRef.current) return
        const range = document.createRange()
        range.selectNode(elRef.current)
        const documentFragment = range.createContextualFragment(processTag(markup))

        // Inject the markup, triggering a re-run!
        elRef.current.innerHTML = ''
        elRef.current.append(documentFragment)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div ref={elRef} dangerouslySetInnerHTML={{ __html: markup }}></div>
}

export default BottleData
