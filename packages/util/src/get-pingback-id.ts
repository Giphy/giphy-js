import { v4 as uuid } from 'uuid'
let pingbackId = ''
const getPingbackId = () => {
    // it exists in memory
    if (!pingbackId) {
        try {
            // it exists in storage
            pingbackId = sessionStorage.getItem('giphyPingbackId') as string
        } catch (_) {}
        if (!pingbackId) {
            // we need to create it
            pingbackId = uuid().replace(/-/g, '').substring(0, 16)
            try {
                // save in storage
                sessionStorage.setItem('giphyPingbackId', pingbackId)
            } catch (_) {}
        }
    }
    return pingbackId
}

export default getPingbackId
