export enum VIDEO_ACTIONS {
    Mute = 'mute',
    Unmute = 'unmute',
    Play = 'play',
    Pause = 'pause',
    Stop = 'stop',
    SeekTo = 'seekTo'
}

export interface GIPHYVideoProps {
    url: string;
}

export interface GIPHYOEmbed {
    title: string;
    html: string;
    height: number;
    width: number;
    author_name: string;
    author_url: string;
    provider_name: string;
    provider_url: string;
    type: string;
}

class GIPHYVideo {
    public url: string
    private iframe: HTMLIFrameElement | null

    constructor({
        url,
    }: GIPHYVideoProps) {
        this.url = url;
    }

    public async loadPlayer(elementId: string) {
        if(!this.url) {
            throw new Error('URL not defined')
        }

        if(!elementId) {
            throw new Error('Element ID not defined')
        }

        const oembed = await this.getGiphyOEmbed(this.url)

        if(oembed.type !== 'video') {
            throw new Error(`Cannot load embed of type ${oembed.type}`)
        }

        const iframeParent = document.getElementById(elementId)
        if(!iframeParent) {
            throw Error('HTMLElement not found')
        } 
        
        iframeParent.innerHTML = oembed.html
        this.iframe = iframeParent.getElementsByTagName('iframe')[0]
    }

    public mute() {
        this.iframe?.contentWindow?.postMessage({
            action: VIDEO_ACTIONS.Mute
        }, '*')
    }

    public unmute() {
        this.iframe?.contentWindow?.postMessage({
            action: VIDEO_ACTIONS.Unmute
        }, '*')
    }

    public play() {
        this.iframe?.contentWindow?.postMessage({
            action: VIDEO_ACTIONS.Play
        }, '*')
    }

    public pause() {
        this.iframe?.contentWindow?.postMessage({
            action: VIDEO_ACTIONS.Pause
        }, '*')
    }

    public stop() {
        this.iframe?.contentWindow?.postMessage({
            action: VIDEO_ACTIONS.Stop
        }, '*')
    }

    public seekTo(time: number) {
        this.iframe?.contentWindow?.postMessage({
            action: VIDEO_ACTIONS.SeekTo,
            value: time
        }, '*')
    }

    private async getGiphyOEmbed(url: string): Promise<GIPHYOEmbed> {
        try {
            const response = await fetch(`https://giphy.com/services/oembed?url=${url}`)

            if(!response.ok) {
                throw new Error('Error fetching oembed')
            }

            const data = await response.json() as GIPHYOEmbed
            return data;
        } catch (err) {
            throw new Error(`Error getting oembed ${JSON.stringify(err)}`)
        }
    }
}

export default GIPHYVideo