import { DateTime } from 'luxon'
import { Box, Group, Paper, Text, Title } from '@mantine/core'
import { Clock } from 'tabler-icons-react'

export default function PostCard({ post, name }) {
    const datestring = DateTime
        .fromRFC2822(post.published)
        .toUTC()
        .toFormat('ccc dd LLL HH:mm')

    return (
        <Paper
            p="xl"
            radius="lg"
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={post.link}
            sx={(theme) => ({
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: theme.colors.dark[5],
                transition: 'all 0.15s ease-in-out 0s',
                cursor: 'pointer',

                '&:hover': {
                    backgroundColor: theme.colors.dark[4],
                }
            })}
        >
            <Title
                order={5}
                sx={(theme) => ({
                    lineHeight: 1.1,
                    color: theme.colors.dark[2],
                })}
            >
                {name}
            </Title>
            <Text
                px="xs"
                mt="xs"
                ml="-xs"
                size="xs"
                weight="bold"
                sx={(theme) => ({
                    lineHeight: 1.8,
                    display: 'inline-block',
                    color: theme.colors.grape[5],
                    borderRadius: theme.radius.xl,
                    backgroundColor: theme.colors.dark[6],
                })}
            >
                {datestring + ' GMT'}
            </Text>
            <Title
                mt="sm"
                order={3}
                sx={(theme) => ({
                    lineHeight: 1.1,
                })}
            >
                {post.title}
            </Title>
            <Box
                sx={(theme) => ({
                    height: 8,
                    width: 16,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    backgroundColor: theme.colors.dark[6],
                    position: 'absolute',
                    top: 27,
                    left: 0,
                })}
            />
        </Paper>
    )
}
