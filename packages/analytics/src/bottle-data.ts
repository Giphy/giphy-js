import { sanitize } from 'dompurify'

const bottleData = (tags: string[] = []) =>
    tags.forEach(tag => {
        const el = document.createElement('html')
        tag = tag.replace('%%CACHEBUSTER%%', Date.now().toString())
        el.innerHTML = sanitize(tag)
        const pixel = el.querySelector('img')
        if (pixel) {
            const head = document.querySelector('head')
            if (head) head.appendChild(pixel)
        }
    })

export default bottleData
