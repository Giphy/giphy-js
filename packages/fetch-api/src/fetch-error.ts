class FetchError extends Error {
    statusText: string
    status: number
    url: string
    constructor(message: string, url: string, status: number = 0, statusText: string = '') {
        super(message)
        this.url = url
        this.status = status
        this.statusText = statusText
    }
}

export default FetchError
