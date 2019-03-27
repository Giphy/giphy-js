import GiphyFetchAPI from '../src/api'

const gf = new GiphyFetchAPI('4OMJYpPoYwVpe')

const categories = async () => {
    try {
        const result = await gf.categories()
        console.log(`categories`, result)
    } catch (error) {
        console.error(`index.tsx:10`, error, `error`)
    }
}
const gif = async () => {
    try {
        const result = await gf.gif('3oEjHGr1Fhz0kyv8Ig')
        console.log(`gif`, result)
    } catch (error) {
        console.error(`index.tsx:18`, error, `error`)
    }
}
const gifs = async () => {
    try {
        const result = await gf.gifs(['3oEjHGr1Fhz0kyv8Ig'])
        console.log(`gifs`, result)
    } catch (error) {
        console.error(`index.tsx:26`, error, `error`)
    }
}
const gifByCategory = async () => {
    try {
        const result = await gf.gifs('tv', 'arrested-development')
        console.log(`gifByCategory`, result)
    } catch (error) {
        console.error(`index.tsx:34`, error, `error`)
    }
}
const related = async () => {
    try {
        const result = await gf.related('3oEjHGr1Fhz0kyv8Ig')
        console.log(`related`, result)
    } catch (error) {
        console.error(`index.tsx:18`, error, `error`)
    }
}
const search = async () => {
    try {
        const result = await gf.search('dogs', { sort: 'recent' })
        console.log(`search`, result)
    } catch (error) {
        console.error(`index.tsx:42`, error, `error`)
    }
}
const subcategories = async () => {
    try {
        const result = await gf.subcategories('tv')
        console.log(`subategories`, result)
    } catch (error) {
        console.error(`index.tsx:50`, error, `error`)
    }
}

const trending = async () => {
    try {
        const result = await gf.trending()
        console.log(`trending`, result)
    } catch (error) {
        console.error(`index.tsx:59`, error, `error`)
    }
}

const random = async () => {
    try {
        const result = await gf.random()
        console.log(`random`, result)
    } catch (error) {
        console.error(`index.tsx:68`, error, `error`)
    }
}
categories()
search()
gif()
gifs()
gifByCategory()
categories()
subcategories()
trending()
random()
related()
