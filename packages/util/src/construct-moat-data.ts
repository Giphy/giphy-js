type MoatData = {
    moatClientLevel1: string
    moatClientLevel2: string
    moatClientLevel3: string
    moatClientLevel4: string
    moatClientSlicer1: string
    moatClientSlicer2: string
    zMoatPosition: string
    zMoatSession?: string
}

type Tracker = {
    vendor: string
    verificationParameters: any
}

type TData = {
    web?: Tracker[]
}

export const constructMoatData = ({ tdata }: { tdata: TData }): MoatData | undefined => {
    const [moatTrackerData] = tdata?.web?.filter(tracker => tracker.vendor === 'Moat') || []
    if (moatTrackerData?.verificationParameters) {
        const {
            moatClientLevel1 = '_ADVERTISER_',
            moatClientLevel2 = '_CAMPAIGN_',
            moatClientLevel3 = '_LINE_ITEM_',
            moatClientLevel4 = '_CREATIVE_',
            moatClientSlicer1 = '_SITE_',
            moatClientSlicer2 = '_PLACEMENT_',
            zMoatPosition = '_POSITION_',
        } = moatTrackerData.verificationParameters

        return {
            moatClientLevel1,
            moatClientLevel2,
            moatClientLevel3,
            moatClientLevel4,
            moatClientSlicer1,
            moatClientSlicer2,
            zMoatPosition,
        }
    }
}
