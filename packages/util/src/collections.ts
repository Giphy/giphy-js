export function mapObject(object: any, mapFn: (val?: any, key?: string) => any): any {
    if (Array.isArray(object)) {
        throw `This map is just for objects, just use array.map for arrays`
    }
    return Object.keys(object).reduce((result: any, key: string) => {
        result[key] = mapFn(object[key], key)
        return result
    }, {})
}
