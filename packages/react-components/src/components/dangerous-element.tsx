import React, { useRef, useLayoutEffect } from 'react'
/**
 * Execute a script tag in a React component.
 * https://macarthur.me/posts/script-tags-in-react/
 */
function DangrousElement({ markup }: { markup: string }) {
    const elRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!elRef.current) return
        const range = document.createRange()
        range.selectNode(elRef.current)
        const documentFragment = range.createContextualFragment(markup)

        // Inject the markup, triggering a re-run!
        elRef.current.innerHTML = ''
        elRef.current.append(documentFragment)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div ref={elRef} dangerouslySetInnerHTML={{ __html: markup }}></div>
}

export default DangrousElement
