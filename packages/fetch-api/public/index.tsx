import GiphyFetchAPI from '../src/api'

const gf = new GiphyFetchAPI('4OMJYpPoYwVpe')

const categories = async () => {
    const result = await gf.categories()
    console.log(`categories`, result)
}
const gif = async () => {
    const result = await gf.gif('3oEjHGr1Fhz0kyv8Ig')
    console.log(`gif`, result)
}
const gifs = async () => {
    const result = await gf.gifs(['3oEjHGr1Fhz0kyv8Ig'])
    console.log(`gifs`, result)
}
const gifByCategory = async () => {
    const result = await gf.gifs('tv', 'arrested-development')
    console.log(`gifByCategory`, result)
}
const search = async () => {
    const result = await gf.search('dogs', { sort: 'recent' })
    console.log(`search`, result)
}
const subcategories = async () => {
    const result = await gf.subcategories('tv')
    console.log(`subategories`, result)
}

const trending = async () => {
    const result = await gf.trending()
    console.log(`trending`, result)
}

const random = async () => {
    const result = await gf.random()
    console.log(`random`, result)
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
