import { v4 as uuid } from 'uuid'

interface GIPHYVideoOptions {
    events?: GIPHYVideoEvents
    width?: string
    height?: string
}

interface GIPHYVideoEvents {
    playVideo?: VoidFunction
    pauseVideo?: VoidFunction
    setVolume?: (volume: number) => void
}

class GIPHYVideo {
    private uuid: string
    private giphyId: string
    private options?: GIPHYVideoOptions
    private iframe: HTMLIFrameElement | null

    constructor(giphyVideoUrl: string, options?: GIPHYVideoOptions) {
        const giphyId = giphyVideoUrl.split('-').at(-1)

        if(!giphyId) {
            throw Error('Wrong GIPHY video url')
        }

        this.giphyId = giphyId
        this.options = options
        this.iframe = null
        this.uuid = uuid()
    }

    public loadPlayer(elementId: string) {
        const iframeParent = document.getElementById(elementId)
        if(!iframeParent) {
            throw Error('HTMLElement not found')
        } 
        
        const iframe = document.createElement("iframe");
        if(this.options?.width) iframe.width = this.options?.width
        if(this.options?.height) iframe.height = this.options?.height

        iframe.src = this.getGiphyEmbedUrl()
        iframeParent.appendChild(iframe)
        iframe.id = 'GIPHY Iframe'
        this.iframe = iframe
    }

    public mute() {
        if(!this.iframe) {
            throw Error('No player setup')
        }

        this.iframe.contentWindow?.postMessage('mute', '*')
    }

    public unmute() {
        if(!this.iframe) {
            throw Error('No player setup')
        }

        this.iframe.contentWindow?.postMessage('unmute', '*')
    }

    private getGiphyEmbedUrl() {
        if(!this.uuid) {
            throw Error('UUID not defined')
        }

        if(!this.giphyId) {
            throw Error('GIPHY ID not defined')
        }

        return `https://giphy.com/embed/${this.giphyId}/video?uuid=${this.uuid}`
    }

    private createListeners() {
        console.log(this.uuid)
    }
}

export default GIPHYVideo