function MoatDisplayLoader() {
    // @ts-ignore
    this.a = 'moat-display-loader'
}
MoatDisplayLoader.prototype.b = function(h: any) {
    var k = this
    // @ts-ignore
    return new Promise(function(resolve, reject) {
        // @ts-ignore
        typeof document === 'undefined' && reject("moat-display-loader: Moat tag doesn't support current environment")
        var b = document.createElement('script'),
            d = document.querySelector('head')
        ;(b && d) || reject("moat-display-loader: Moat tag can't be loaded")
        var a = Math.round(Date.now() / 1e3),
            m = a << 1
        // @ts-ignore
        a = String.fromCharCode(77, 79, 65, 84) + window[String.fromCharCode(98, 116, 111, 97)](a)
        window[a] = k
        // @ts-ignore
        window[a].resolve = resolve
        // @ts-ignore
        window[a].reject = reject
        b.type = 'text/javascript'
        d!.insertBefore(b, d!.childNodes[0] || null)
        b.src = 'https://z.moatads.com/' + h + '/moatad.js#' + m
    })
}
interface Moat {
    loadMoatTag(partnerCode: string): Promise<any>
    startTracking(adElement: HTMLElement, adIdentifiers: object): number
    stopTracking(adNum: number): void
    killMoatTag(): void
    adFindingMethod(): void
}
// @ts-ignore
var f = new MoatDisplayLoader(),
    g: Moat = {
        stopTracking: () => {},
        killMoatTag: () => {},
        startTracking: () => 0,
        loadMoatTag: f.b,
        adFindingMethod: f.a,
    }
export default g
