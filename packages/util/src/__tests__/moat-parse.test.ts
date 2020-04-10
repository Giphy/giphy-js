import { constructMoatData } from '../construct-moat-data'

jest.mock('../webp-check')

const tdata = {
    om: [],
    bartab: [],
    web: [
        {
            vendor: 'Moat',
            verificationParameters: {
                moatClientLevel1: '9126b66f-5401-4c95-91f3-59df290f7eab',
                moatClientLevel2: 'c31f9862-3502-4bf9-b65d-662fe37f0f67',
                moatClientLevel3: '894',
                moatClientLevel4: 'SVrp0BVItzp9mjBLAO',
                moatClientSlicer1: 'ecb949ed-a624-4297-93cd-a70fb3450df3',
                moatClientSlicer2: 'giphytrending',
                zMoatPosition: '0',
            },
        },
    ],
}
describe('parsing of moat data', () => {
    const ref = tdata.web[0].verificationParameters
    test('constructMoatData', () => {
        expect(constructMoatData({ tdata })).toEqual({
            moatClientLevel1: ref.moatClientLevel1,
            moatClientLevel2: ref.moatClientLevel2,
            moatClientLevel3: ref.moatClientLevel3,
            moatClientLevel4: ref.moatClientLevel4,
            moatClientSlicer1: ref.moatClientSlicer1,
            moatClientSlicer2: ref.moatClientSlicer2,
            zMoatPosition: ref.zMoatPosition,
        })
    })
    test('constructMoatData defaults', () => {
        expect(
            constructMoatData({
                tdata: {
                    web: [
                        {
                            vendor: 'Moat',
                            verificationParameters: {},
                        },
                    ],
                },
            })
        ).toEqual({
            moatClientLevel1: '_ADVERTISER_',
            moatClientLevel2: '_CAMPAIGN_',
            moatClientLevel3: '_LINE_ITEM_',
            moatClientLevel4: '_CREATIVE_',
            moatClientSlicer1: '_SITE_',
            moatClientSlicer2: '_PLACEMENT_',
            zMoatPosition: '_POSITION_',
        })
    })
    test('constructMoatData undefined', () => {
        expect(constructMoatData({ tdata: {} })).toEqual(undefined)
        expect(constructMoatData({ tdata: { web: [] } })).toEqual(undefined)
    })
})
