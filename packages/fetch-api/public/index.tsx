import { GiphyFetch } from '../src'

const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const categories = async () => {
    try {
        const result = await gf.categories()
        console.log('categories', result)
    } catch (error) {
        console.error('categories', error)
    }
}
const gif = async () => {
    try {
        const result = await gf.gif('3oEjHGr1Fhz0kyv8Ig')
        console.log('gif', result)
    } catch (error) {
        console.error('gif', error)
    }
}
const gifs = async () => {
    try {
        const result = await gf.gifs(['3oEjHGr1Fhz0kyv8Ig'])
        console.log('gifs', result)
    } catch (error) {
        console.error('gifs', error)
    }
}
const gifByCategory = async () => {
    try {
        const result = await gf.gifs('tv', 'arrested-development')
        console.log('gifByCategory', result)
    } catch (error) {
        console.error('gifByCategory', error)
    }
}
const related = async () => {
    try {
        const result = await gf.related('3oEjHGr1Fhz0kyv8Ig', { limit: 4 })
        console.log('related', result)
    } catch (error) {
        console.error('related', error)
    }
}

const relatedClips = async () => {
    try {
        const result = await gf.related('W2nuhlWbyVmV73jIsc', { type: 'videos' })
        console.log('related videos', result)
    } catch (error) {
        console.error('related videos', error)
    }
}

const animate = async () => {
    try {
        const result = await gf.animate('hello')
        console.log('animate', result)
    } catch (error) {
        console.error('animate', error)
    }
}
const search = async () => {
    try {
        const result = await gf.search('dogs', { sort: 'recent' })
        console.log('search', result)
    } catch (error) {
        console.error('search', error)
    }
}

const searchVideos = async () => {
    try {
        const result = await gf.search('dogs', { sort: 'recent', type: 'videos' })
        console.log('search videos', result)
    } catch (error) {
        console.error('search videos', error)
    }
}
const searchChannel = async () => {
    try {
        const result = await gf.search('dogs', { sort: 'recent', channel: 'reactions' })
        console.log('search channel', result)
    } catch (error) {
        console.error('search', error)
    }
}
const subcategories = async () => {
    try {
        const result = await gf.subcategories('tv')
        console.log('subategories', result)
    } catch (error) {
        console.error('subcategories', error)
    }
}

const trending = async () => {
    try {
        const result = await gf.trending()
        console.log('trending', result)
    } catch (error) {
        console.error('trending', error)
    }
}

const random = async () => {
    try {
        const result = await gf.random()
        console.log('random', result)
    } catch (error) {
        console.error('random', error)
    }
}

const emoji = async () => {
    try {
        const result = await gf.emoji({ limit: 2 })
        console.log('emoji', result)
    } catch (error) {
        console.error('emoji', error)
    }
}

const text = async () => {
    try {
        const result = await gf.search('pasta', { limit: 2, type: 'text' })
        console.log('text', result)
    } catch (error) {
        console.error('text', error)
    }
}

const textTrending = async () => {
    try {
        const result = await gf.trending({ limit: 2, type: 'text' })
        console.log('textTrending', result)
    } catch (error) {
        console.error('textTrending', error)
    }
}

const extraQS = async () => {
    try {
        const gf = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh', { countryCode: 'us' })
        const result = await gf.trending({
            limit: 2,
            type: 'text',
        })
        console.log('extra qs', result)
    } catch (error) {
        console.error('extra qs', error)
    }
}
categories()
search()
searchChannel()
gif()
gifs()
gifByCategory()
categories()
subcategories()
trending()
random()
related()
emoji()
text()
textTrending()
animate()
searchVideos()
extraQS()
relatedClips()
