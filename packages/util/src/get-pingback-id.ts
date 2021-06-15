import { v4 as uuid } from 'uuid'
let pingbackId = ''

const idLength = 16

/* istanbul ignore next */
const noUUIDRandom = () => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < idLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
const getPingbackId = () => {
    // it exists in memory
    if (!pingbackId) {
        try {
            // it exists in storage
            pingbackId = sessionStorage.getItem('giphyPingbackId') as string
        } catch (_) {}
        if (!pingbackId) {
            // we need to create it
            const hexTime = new Date().getTime().toString(16) // was told to mimic what we had
            try {
                // React Native doesn't support uuid without a polyfill
                pingbackId = `${hexTime}${uuid().replace(/-/g, '')}`.substring(0, idLength) // 16 character max
            } catch (error) {
                /* istanbul ignore next */
                pingbackId = noUUIDRandom()
            }
            try {
                // save in storage
                sessionStorage.setItem('giphyPingbackId', pingbackId)
            } catch (_) {}
        }
    }
    return pingbackId
}

export default getPingbackId
