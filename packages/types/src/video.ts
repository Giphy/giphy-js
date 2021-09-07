import { IImages, IURLAsset } from './images'

export interface IVideoAssets {
    source: IURLAsset
    '360p': IURLAsset
    '480p': IURLAsset
    '720p': IURLAsset
    '1080p': IURLAsset
    '4k': IURLAsset
}
// TODO add more languages
export type Language = 'en' | 'fr' | 'sp' | 'it' | 'de'
export interface ICaption {
    srt: string
    vtt: string
}
export default interface IVideo {
    assets: IVideoAssets
    description: string
    dash_manifest_url: string
    hls_manifest_url: string
    previews: IImages
    captions: Partial<Record<Language, ICaption>>
    native: Language
}
