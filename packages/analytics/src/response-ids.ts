export default function getLastSearchResponseId() {
    try {
        const sessionIds = sessionStorage.getItem('responseIds')
        if (sessionIds) {
            const searchResponseIds = JSON.parse(sessionIds) || []
            return searchResponseIds[searchResponseIds.length - 2]
        }
    } catch (e) {
        console.error(e)
    }
}
