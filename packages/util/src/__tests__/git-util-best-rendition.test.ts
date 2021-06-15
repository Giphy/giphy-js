import { setRenditionScaleUpMaxPixels } from '../bestfit'
import { getBestRenditionUrl, getBestVideo } from '../gif-utils'

const testGifLandscape: any = {
    images: {
        fixed_height_still: {
            url: '/media/200_s.gif',
            width: '355',
            height: '200',
        },
        original_still: {
            url: '/media/giphy_s.gif',
            width: '600',
            height: '338',
        },
        fixed_width: {
            url: '/media/200x113.gif',
            width: '200',
            height: '113',
            size: '77670',
            mp4: '/media/200x113.mp4',
            mp4_size: '11777',
            webp: '/media/200x113.webp',
            webp_size: '52404',
        },
        fixed_height_small_still: {
            url: '/media/100_s.gif',
            width: '178',
            height: '100',
        },
        fixed_height_small: {
            url: '/media/178x100.gif',
            width: '178',
            height: '100',
            size: '169486',
            mp4: '/media/100.mp4',
            mp4_size: '68837',
            webp: '/media/100.webp',
            webp_size: '43392',
        },
        fixed_width_small_still: {
            url: '/media/100w_s.gif',
            width: '100',
            height: '56',
        },
        fixed_width_still: {
            url: '/media/200w_s.gif',
            width: '200',
            height: '113',
        },
        fixed_width_small: {
            url: '/media/100x56.gif',
            width: '100',
            height: '56',
            size: '77670',
            mp4: '/media/100x56.mp4',
            mp4_size: '31328',
            webp: '/media/100x56.webp',
            webp_size: '17910',
        },
        original: {
            url: '/media/600x338.gif',
            width: '600',
            height: '338',
            size: '1020165',
            frames: '14',
            mp4: '/media/giphy.mp4',
            mp4_size: '41339',
            webp: '/media/giphy.webp',
            webp_size: '295984',
        },
        fixed_height: {
            url: '/media/355x200.gif',
            width: '355',
            height: '200',
            size: '169486',
            mp4: '/media/200.mp4',
            mp4_size: '11945',
            webp: '/media/200.webp',
            webp_size: '129066',
        },
    },
}

const testVideo = {
    ...testGifLandscape,
    video: {
        assets: {
            fixed_width: {
                url: '/media/200x113.gif',
                width: '200',
                height: '113',
                size: '77670',
                mp4: '/media/200x113.mp4',
                mp4_size: '11777',
                webp: '/media/200x113.webp',
                webp_size: '52404',
            },
            fixed_width_small: {
                url: '/media/100x56.gif',
                width: '100',
                height: '56',
                size: '77670',
                mp4: '/media/100x56.mp4',
                mp4_size: '31328',
                webp: '/media/100x56.webp',
                webp_size: '17910',
            },
            original: {
                url: '/media/600x338.gif',
                width: '600',
                height: '338',
                size: '1020165',
                frames: '14',
                mp4: '/media/giphy.mp4',
                mp4_size: '41339',
                webp: '/media/giphy.webp',
                webp_size: '295984',
            },
            fixed_height: {
                url: '/media/355x200.gif',
                width: '355',
                height: '200',
                size: '169486',
                mp4: '/media/200.mp4',
                mp4_size: '11945',
                webp: '/media/200.webp',
                webp_size: '129066',
            },
            fixed_height_small: {
                url: '/media/178x100.gif',
                width: '178',
                height: '100',
                size: '169486',
                mp4: '/media/100.mp4',
                mp4_size: '68837',
                webp: '/media/100.webp',
                webp_size: '43392',
            },
        },
    },
}

const testGifPortrait: any = {
    images: {
        fixed_height_still: {
            url: '/media/200_s.gif',
            width: '200',
            height: '355',
        },
        original_still: {
            url: '/media/giphy_s.gif',
            width: '338',
            height: '600',
        },
        fixed_width: {
            url: '/media/113x200.gif',
            width: '113',
            height: '200',
            size: '77670',
            mp4: '/media/200x113.mp4',
            mp4_size: '11777',
            webp: '/media/200x113.webp',
            webp_size: '52404',
        },
        fixed_height_small_still: {
            url: '/media/100_s.gif',
            width: '100',
            height: '178',
        },
        fixed_height_small: {
            url: '/media/100x178.gif',
            width: '100',
            height: '178',
            size: '169486',
            mp4: '/media/100.mp4',
            mp4_size: '68837',
            webp: '/media/100.webp',
            webp_size: '43392',
        },
        fixed_width_small_still: {
            url: '/media/100w_s.gif',
            width: '56',
            height: '100',
        },
        fixed_width_still: {
            url: '/media/200w_s.gif',
            width: '113',
            height: '200',
        },
        fixed_width_small: {
            url: '/media/56x100.gif',
            width: '56',
            height: '100',
            size: '77670',
            mp4: '/media/100x56.mp4',
            mp4_size: '31328',
            webp: '/media/100x56.webp',
            webp_size: '17910',
        },
        original: {
            url: '/media/338x600.gif',
            width: '338',
            height: '600',
            size: '1020165',
            frames: '14',
            mp4: '/media/giphy.mp4',
            mp4_size: '41339',
            webp: '/media/giphy.webp',
            webp_size: '295984',
        },
        fixed_height: {
            url: '/media/200x355.gif',
            width: '200',
            height: '355',
            size: '169486',
            mp4: '/media/200.mp4',
            mp4_size: '11945',
            webp: '/media/200.webp',
            webp_size: '129066',
        },
    },
}

const testGifVideo: any = {
    type: 'video',
    images: {},
    video: { previews: testGifLandscape.images },
}

describe('gif util', () => {
    beforeEach(() => {
        setRenditionScaleUpMaxPixels(50)
    })
    test('getBestRenditionUrl ', () => {
        expect(getBestRenditionUrl(testGifLandscape, 450, 350)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 400, 300)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 300, 200)).toEqual('/media/355x200.gif')
        expect(getBestRenditionUrl(testGifLandscape, 200, 200)).toEqual('/media/355x200.gif')
        expect(getBestRenditionUrl(testGifLandscape, 100, 100)).toEqual('/media/100x56.gif')
        expect(getBestRenditionUrl(testGifLandscape, 300, 200)).toEqual('/media/355x200.gif')
        // within the scaleup range
        expect(getBestRenditionUrl(testGifLandscape, 200, 100)).toEqual('/media/178x100.gif')
        expect(getBestRenditionUrl(testGifLandscape, 200, 100)).toEqual('/media/178x100.gif')
        expect(getBestRenditionUrl(testGifLandscape, 178, 100)).toEqual('/media/178x100.gif')
        expect(getBestRenditionUrl(testGifLandscape, 100, 100)).toEqual('/media/100x56.gif')
        expect(getBestRenditionUrl(testGifLandscape, 1, 1)).toEqual('/media/100x56.gif')
        expect(getBestRenditionUrl(testGifLandscape, 0, 1)).toEqual('')
    })
    test('getBestVideo ', () => {
        expect(getBestVideo(testVideo.video, 450, 350)?.url).toEqual('/media/600x338.gif')
        expect(getBestVideo(testVideo.video, 400, 300)?.url).toEqual('/media/600x338.gif')
        expect(getBestVideo(testVideo.video, 300, 200)?.url).toEqual('/media/355x200.gif')
        expect(getBestVideo(testVideo.video, 200, 200)?.url).toEqual('/media/355x200.gif')
        expect(getBestVideo(testVideo.video, 100, 100)?.url).toEqual('/media/100x56.gif')
        expect(getBestVideo(testVideo.video, 300, 200)?.url).toEqual('/media/355x200.gif')
        // within the scaleup range
        expect(getBestVideo(testVideo.video, 200, 100)?.url).toEqual('/media/178x100.gif')
        expect(getBestVideo(testVideo.video, 200, 100)?.url).toEqual('/media/178x100.gif')
        expect(getBestVideo(testVideo.video, 178, 100)?.url).toEqual('/media/178x100.gif')
        expect(getBestVideo(testVideo.video, 100, 100)?.url).toEqual('/media/100x56.gif')
        expect(getBestVideo(testVideo.video, 1, 1)?.url).toEqual('/media/100x56.gif')
        // expect(getBestVideo(testVideo.video, 0, 1).u).toEqual('')
    })
    test('getBestRenditionUrl portrait target landscape gif ', () => {
        expect(getBestRenditionUrl(testGifLandscape, 700, 450)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 350, 450)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 300, 400)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 200, 300)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 100, 200)).toEqual('/media/355x200.gif')
        expect(getBestRenditionUrl(testGifLandscape, 50, 100)).toEqual('/media/100x56.gif')
        expect(getBestRenditionUrl(testGifLandscape, 1, 1)).toEqual('/media/100x56.gif')
        expect(getBestRenditionUrl(testGifLandscape, 0, 1)).toEqual('')
    })
    test('getBestRenditionUrl landscape target portrait gif ', () => {
        expect(getBestRenditionUrl(testGifPortrait, 700, 700)).toEqual('/media/338x600.gif')
        expect(getBestRenditionUrl(testGifPortrait, 338, 200)).toEqual('/media/338x600.gif')
        expect(getBestRenditionUrl(testGifPortrait, 300, 200)).toEqual('/media/338x600.gif')
        expect(getBestRenditionUrl(testGifPortrait, 200, 100)).toEqual('/media/200x355.gif')
        expect(getBestRenditionUrl(testGifPortrait, 100, 50)).toEqual('/media/56x100.gif')
        expect(getBestRenditionUrl(testGifPortrait, 1, 1)).toEqual('/media/56x100.gif')
        expect(getBestRenditionUrl(testGifPortrait, 0, 1)).toEqual('')
    })
    test('getBestRenditionUrl type video ', () => {
        expect(getBestRenditionUrl(testGifVideo, 450, 350)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifVideo, 400, 300)).toEqual('/media/600x338.gif')
    })
    test('getBestRenditionUrl higher quality: 20', () => {
        setRenditionScaleUpMaxPixels(20)
        expect(getBestRenditionUrl(testGifLandscape, 450, 350)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 400, 300)).toEqual('/media/600x338.gif')
        expect(getBestRenditionUrl(testGifLandscape, 300, 200)).toEqual('/media/355x200.gif')
        expect(getBestRenditionUrl(testGifLandscape, 200, 200)).toEqual('/media/355x200.gif')
        expect(getBestRenditionUrl(testGifLandscape, 100, 100)).toEqual('/media/178x100.gif')
        expect(getBestRenditionUrl(testGifLandscape, 300, 200)).toEqual('/media/355x200.gif')
        // within the scaleup range
        expect(getBestRenditionUrl(testGifLandscape, 200, 100)).toEqual('/media/200x113.gif')
        expect(getBestRenditionUrl(testGifLandscape, 200, 100)).toEqual('/media/200x113.gif')
        expect(getBestRenditionUrl(testGifLandscape, 178, 100)).toEqual('/media/178x100.gif')
        expect(getBestRenditionUrl(testGifLandscape, 100, 100)).toEqual('/media/178x100.gif')
        expect(getBestRenditionUrl(testGifLandscape, 1, 1)).toEqual('/media/100x56.gif')
        expect(getBestRenditionUrl(testGifLandscape, 0, 1)).toEqual('')
    })
})
