import { DateTime } from 'luxon'
import { Paper, Text, Title } from '@mantine/core'
import { Clock, Rss } from 'tabler-icons-react'

function parseContent(str, limit = undefined) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')

    let text = (doc.body.textContent || doc.body.innerText || '')
        .split(/(\[?((\.{3})|(…))\]?)/)[0]
        .trim()

    if (limit) {
        const words = text.split(' ')
        text = words.length > limit ? words.slice(0, limit).join(' ') : text
        text = (text.endsWith('.') ? text.substr(0, text.length - 1) : text) + ' ...'
    }

    return text
}

export default function PostCard({ post, name }) {
    const datestring = DateTime
        .fromJSDate(new Date(post.published))
        .toUTC()
        .toFormat('ccc dd LLL')

    return (
        <Paper
            p="xl"
            radius="md"
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={post.link}
            sx={(theme) => ({
                height: '100%',
                backgroundColor: theme.colors.gray[1],
                transition: 'all 0.15s ease-in-out 0s',
                userSelect: 'none',
                cursor: 'pointer',

                '&:hover': {
                    backgroundColor: theme.colors.gray[2],
                }
            })}
        >
            <Text
                size="xs"
                weight="bold"
                sx={(theme) => ({
                    color: theme.colors.gray[6],
                })}
            >
                {datestring}
            </Text>
            <Title
                order={5}
                sx={(theme) => ({
                    color: theme.colors.grape[6],
                })}
            >
                {name}
            </Title>
            <Title
                mt="lg"
                order={3}
                sx={(theme) => ({
                    lineHeight: 1.25,
                    color: theme.colors.gray[9],
                })}
            >
                {parseContent(post.title)}
            </Title>
            <Text
                mt="md"
                size="sm"
                sx={(theme) => ({
                    color: theme.colors.gray[9],
                })}
            >
                {parseContent(post.description, 30)}
            </Text>
        </Paper>
    )
}
