const sessionStorageMock = (function() {
    let store: any = {}

    return {
        getItem: function(key: string) {
            return store[key] || null
        },
        setItem: function(key: string, value: any) {
            store[key] = value.toString()
        },
        clear: function() {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
})
