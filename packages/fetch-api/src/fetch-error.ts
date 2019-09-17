class FetchError extends Error {
    statusText: string
    status: number
    constructor(message: string, status: number = 0, statusText: string = '') {
        super(message)
        this.status = status
        this.statusText = statusText
    }
}

export default FetchError
