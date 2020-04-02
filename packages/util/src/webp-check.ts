export let SUPPORTS_WEBP: null | boolean = null
/* istanbul ignore next */
export const checkIfWebP = new Promise(resolve => {
    if (typeof Image === 'undefined') {
        resolve(false)
    }
    const webp = new Image()
    webp.onload = () => {
        SUPPORTS_WEBP = true
        resolve(SUPPORTS_WEBP)
    }
    webp.onerror = () => {
        SUPPORTS_WEBP = false
        resolve(SUPPORTS_WEBP)
    }
    webp.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
})
