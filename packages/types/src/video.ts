import { IImages, IURLAsset } from './images'

export interface IVideoAssets {
    source: IURLAsset
    '360p': IURLAsset
    '480p': IURLAsset
    '720p': IURLAsset
    '1080p': IURLAsset
    '4k': IURLAsset
}

export default interface IVideo {
    assets: IVideoAssets
    description: string
    dash_manifest_url: string
    hls_manifest_url: string
    previews: IImages
}
