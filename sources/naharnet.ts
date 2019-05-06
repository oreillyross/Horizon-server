import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

const href = 'http://www.naharnet.com/lebanon'

interface Href {
    href: string
}

interface Description {
    description: string
}

interface Source {
    title: string
}

const getMainSources = async (url: string) => {
    let sources: Array<Source> = []
    let description: Array<Description> = []
    let href: Array<Href> = []
    try {
        const response = await fetch(url)
        const html = await response.text().catch((err) => console.error('got you',err))
        const $ = cheerio.load(html as any as CheerioElement)
        $('.latest-story a.title').each(function(i) {
            sources[i] = { 'title': ($(this).text()) }
        })
        $('.latest-story').each(function(i) {
            description[i] = { 'description': $(this).children('p').eq(1).text() }
        })
        $('.latest-story a.title').each(function(i) {
            href[i] = ({ 'href': `http://naharnet.com` + $(this).attr('href') })
        })
    }
    catch (err) {
        console.error(err)
    }
    finally {
        return sources.map((source, i) => {
            return {
                title: source.title,
                description: description[i].description,
                source: 'Naharnet',
                href: href[i].href,
                date: new Date()
            }
        })
    }
}




const naharnetSources = getMainSources(href).catch(err => console.log(`some bad error here ${err}`))

export {  naharnetSources as default }


