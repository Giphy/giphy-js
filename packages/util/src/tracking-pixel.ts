import DOMPurify from 'dompurify'

const injectTrackingPixel = (tags: string[] = []) => {
    tags.forEach((tag) => {
        const el = document.createElement('html')
        tag = tag.replace('%%CACHEBUSTER%%', Date.now().toString())
        el.innerHTML = DOMPurify.sanitize(tag)
        const pixel = el.querySelector('img')
        if (pixel) {
            document?.querySelector('head')?.appendChild(pixel)
        }
    })
}

export default injectTrackingPixel
