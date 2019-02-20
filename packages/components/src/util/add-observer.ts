const addObserver = async (el: HTMLElement, cb: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
    // @ts-ignore
    if (!window.IntersectionObserver) {
        await import('intersection-observer')
    }
    this.observer = new IntersectionObserver(cb, options)
    this.observer.observe(el)
    return this.observer
}

export default addObserver
