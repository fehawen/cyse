import got from 'got'
import { XMLParser } from 'fast-xml-parser'
import { sites } from '../../../data/sites'

const parser = new XMLParser()

async function parseRSSFeed(site) {
    const items = []
    const result = await got(site.url).text()
    const feed = parser.parse(result)

    if (feed.rss && feed.rss.channel && feed.rss.channel.item) {
        for (const item of feed.rss.channel.item) {
            items.push({
                link: item.link,
                title: item.title.replace(/(&#?\w+;)/g, ''),
                published: item.pubDate,
            })
        }
    }

    return items
}

export default async function handler(req, res) {
    const { id } = req.query
    const site = sites.find((s) => s.id === id)

    if (!site) {
        res.status(404).end()
    }

    const posts = await parseRSSFeed(site)

    res.status(200).json({ posts })
}
