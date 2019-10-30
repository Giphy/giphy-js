export function mapValues(object: any, mapFn: (val: any, key: string) => any): any {
    if (Array.isArray(object)) {
        throw `This map is just for objects, just use array.map for arrays`
    }
    return Object.keys(object).reduce((result: any, key: string) => {
        result[key] = mapFn(object[key], key)
        return result
    }, {})
}

export function forEach(object: any, mapFn: (val: any, key: any) => void): void {
    if (Array.isArray(object)) {
        throw `This map is just for objects, just use array.forEach for arrays`
    }
    return Object.keys(object).forEach((key: string) => {
        mapFn(object[key], key)
    })
}

export function take<T>(arr: T[], count = 0): T[] {
    return arr.slice(0, count)
}

export function without<T>(arr: T[], values: T[]): T[] {
    return arr.filter(val => values.indexOf(val) === -1)
}

export function pick<T extends object, U extends keyof T>(object: T, pick: Array<U>): Pick<T, U> {
    const res: Partial<T> = {}
    pick.forEach((key: U) => {
        if (object[key] !== undefined) {
            res[key] = object[key]
        }
    })
    return res as Pick<T, U>
}
