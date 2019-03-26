const addObserver = async (el: HTMLElement, cb: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
    // @ts-ignore
    if (!window.IntersectionObserver) {
        // @ts-ignore
        await import('intersection-observer')
    }
    const observer = new IntersectionObserver(cb, options)
    if (el) {
        observer.observe(el)
    }
    return observer
}

export default addObserver
