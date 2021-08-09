export interface IRendition {
    width: number
    height: number
}

export interface IImage extends IRendition {
    url: string
    size?: string
}

export interface IURLAsset extends IImage {}

export interface IMP4 extends IRendition {
    mp4: string
    mp4_size: string
}

export interface IWebP {
    webp: string
    webp_size: string
}

export type ImageAllTypes = IImage & IWebP & IMP4

export interface IImages {
    fixed_height_still: IImage
    original_still: IImage
    fixed_width: ImageAllTypes
    fixed_height_small_still: IImage
    fixed_height_downsampled: IImage & IWebP
    preview: IImage
    fixed_height_small: ImageAllTypes
    downsized_still: IImage
    downsized: IImage
    downsized_large: IImage
    fixed_width_small_still: IImage
    preview_webp: IImage
    fixed_width_still: IImage
    fixed_width_small: ImageAllTypes
    downsized_small: IImage & IMP4
    fixed_width_downsampled: IImage & IWebP
    downsized_medium: IImage
    original: ImageAllTypes
    fixed_height: ImageAllTypes
    looping: IMP4
    original_mp4: IMP4
    preview_gif: IImage
    '480w_still': IImage
}
