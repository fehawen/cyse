import got from 'got'
import { XMLParser } from 'fast-xml-parser'
import { sites } from '../../../data/sites'

const parser = new XMLParser()

const htmlCodes = {
    '&#8592;': '←',
    '&#8593;': '↑',
    '&#8594;': '→',
    '&#8595;': '↓',
    '&#8596;': '↔',
    '&#8656;': '⇐',
    '&#8657;': '⇑',
    '&#8658;': '⇒',
    '&#8659;': '⇓',
    '&#8660;': '⇔',
    '&#34;': '"',
    '&#38;': '&',
    '&#60;': '<',
    '&#62;': '>',
    '&#128;': '€',
    '&#162;': '¢',
    '&#164;': '¤',
    '&#165;': '¥',
    '&#8194;': ' ',
    '&#8195;': ' ',
    '&#8201;': ' ',
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8216;': '‘',
    '&#8217;': '’',
    '&#8218;': '‚',
    '&#8220;': '“',
    '&#8221;': '”',
    '&#8222;': '„',
    '&#8224;': '†',
    '&#8225;': '‡',
    '&#8226;': '•',
    '&#8230;': '…',
    '&#8240;': '‰',
    '&#8242;': '′',
    '&#8243;': '″',
    '&#8249;': '‹',
    '&#8250;': '›',
    '&#8254;': '‾',
    '&#8260;': '⁄',
    '&#177;': '±',
    '&#188;': '¼',
    '&#189;': '½',
    '&#190;': '¾',
    '&#215;': '×',
    '&#247;': '÷',
    '&#8704;': '∀',
    '&#8706;': '∂',
    '&#8707;': '∃',
    '&#8709;': '∅',
    '&#8711;': '∇',
    '&#8712;': '∈',
    '&#8713;': '∉',
    '&#8715;': '∋',
    '&#8719;': '∏',
    '&#8721;': '∑',
    '&#8722;': '−',
    '&#8727;': '∗',
    '&#8730;': '√',
    '&#8733;': '∝',
    '&#8734;': '∞',
    '&#8736;': '∠',
    '&#8743;': '∧',
    '&#8744;': '∨',
    '&#8745;': '∩',
    '&#8746;': '∪',
    '&#8747;': '∫',
    '&#8756;': '∴',
    '&#8764;': '∼',
    '&#8773;': '≅',
    '&#8776;': '≈',
    '&#8800;': '≠',
    '&#8801;': '≡',
    '&#8804;': '≤',
    '&#8805;': '≥',
    '&#8834;': '⊂',
    '&#8835;': '⊃',
    '&#8836;': '⊄',
    '&#8838;': '⊆',
    '&#8839;': '⊇',
    '&#8853;': '⊕',
    '&#8855;': '⊗',
    '&#8869;': '⊥',
    '&#8901;': '⋅',
}

function htmlCodeToSymbol(htmlCode) {
    if (htmlCode in htmlCodes) {
        return htmlCodes[htmlCode]
    } else {
        return ''
    }
}

async function parseRSSFeed(site) {
    const items = []
    const result = await got(site.url).text()
    const feed = parser.parse(result)

    if (feed.rss && feed.rss.channel && feed.rss.channel.item) {
        for (const item of feed.rss.channel.item) {
            items.push({
                link: item.link,
                title: item.title.replace(/(&#?\w+;)/g, (htmlCode) => htmlCodeToSymbol(htmlCode)),
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
