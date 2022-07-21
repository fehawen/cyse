import { DateTime } from 'luxon'
import { Paper, Text, Title } from '@mantine/core'
import { Clock, Rss } from 'tabler-icons-react'

function hmtlStringToText(str, paragraph = false) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')

    let txt = (doc.body.textContent || doc.body.innerText || '').trim()
    if (paragraph && !txt.endsWith('.')) txt += '.'

    return txt.length > 280 ? txt.substr(0, 280) + ' [...]' : txt
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
                backgroundColor: theme.colors.gray[0],
                transition: 'all 0.15s ease-in-out 0s',
                userSelect: 'none',
                cursor: 'pointer',

                '&:hover': {
                    backgroundColor: theme.colors.gray[1],
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
                {hmtlStringToText(post.title)}
            </Title>
            <Text
                mt="md"
                size="sm"
                sx={(theme) => ({
                    color: theme.colors.gray[9],
                })}
            >
                {hmtlStringToText(post.description, true)}
            </Text>
        </Paper>
    )
}
