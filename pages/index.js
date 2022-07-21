import useSwr from 'swr'
import Head from 'next/head'
import NavbarItem from '../components/NavbarItem'
import PostCard from '../components/PostCard'
import { useEffect, useState } from 'react'
import {
    ActionIcon,
    Affix,
    Alert,
    AppShell,
    Box,
    Burger,
    Button,
    Center,
    Divider,
    Global,
    Grid,
    Group,
    Header,
    Image,
    Loader,
    LoadingOverlay,
    MediaQuery,
    Navbar,
    Paper,
    ScrollArea,
    Text,
    Title,
    ThemeIcon
} from '@mantine/core'
import {
    AlertTriangle,
    ArrowsShuffle,
    BrandGithub,
    CloudDownload,
    RotateDot,
    Rss,
    X
} from 'tabler-icons-react'
import { sites } from '../data/sites'

const fetcher = (url) => fetch(url).then((res) => res.json())
const options = { refreshInterval: 300000  }

function randomFeed() {
    const index = Math.floor(Math.random() * (sites.length - 1))
    return sites[index]
}

function sortSites() {
    return sites.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
}

export default function Index() {
    const [posts, setPosts] = useState([])
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = useState(randomFeed())
    const { data, error } = useSwr(`/api/feed/${selected.id}`, fetcher, options)

    useEffect(() => {
        if (data && data.posts) {
            setPosts(data.posts)
        }
    }, [data])

    function renderContent() {
        if (error) {
            return (
                <Center style={{ height: '100%' }}>
                    <Alert
                        p="xl"
                        color="red"
                        radius="md"
                        title="Something went wrong"
                        icon={<AlertTriangle size={30} />}
                    >
                        The selected RSS feed failed to respond.
                        <Box mt="xl">
                            <Button
                                fullWidth
                                radius="md"
                                color="dark"
                                onClick={() => setSelected(randomFeed())}
                            >
                                Try another one
                            </Button>
                        </Box>
                    </Alert>
                </Center>
            )
        } else if (!data) {
            return (
                <Center style={{ height: '100%' }}>
                    <Loader size="xl" variant="dots" color="purple" />
                </Center>
            )
        } else {
            return posts.length > 0 ? (
                <Grid align="stretch" gutter="lg">
                    {posts.map((post, index) => (
                        <Grid.Col
                            key={`${selected.id}-${index}`}
                            xs={6}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={3}
                        >
                            <PostCard post={post} name={selected.name} />
                        </Grid.Col>
                    ))}
                </Grid>
            ) : (
                <Center style={{ height: '100%' }}>
                    <Alert
                        p="xl"
                        radius="md"
                        color="grape"
                        icon={<Rss size={30} strokeWidth={3} />}
                        title={selected.name}
                    >
                        No posts available right now.
                    </Alert>
                </Center>
            )
        }
    }

    return (
        <>
            <Head>
                <title>CySe | {selected ? selected.name : 'RSS Feed'}</title>
                <meta name="description" content="CySe - A gathering of Cyber Security news from various RSS feeds" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Global
                styles={(theme) => ({
                    body: {
                        color: theme.colors.gray[9]
                    }
                })}
            />
            <AppShell
                fixed
                navbarOffsetBreakpoint="sm"
                navbar={
                    <Navbar
                        pl="sm"
                        hidden={!opened}
                        hiddenBreakpoint="sm"
                        sx={(theme) => ({ border: 0 })}
                        width={{ sm: 280 }}
                    >
                        <LoadingOverlay
                            visible={!data}
                            loader={<div />}
                            sx={(theme) => ({ borderTopRightRadius: theme.radius.md })}
                        />
                        <Divider
                            my="xs"
                            label={
                                <Title
                                    order={4}
                                    sx={(theme) => ({
                                        color: theme.colors.gray[9]
                                    })}
                                >
                                    RSS Feeds
                                </Title>
                            }
                        />
                        <Navbar.Section
                            grow
                            offsetScrollbars
                            scrollbarSize={5}
                            component={ScrollArea}
                        >
                            {sortSites().map((site) => (
                                <NavbarItem
                                    key={site.id}
                                    site={site}
                                    error={false}
                                    active={Boolean(data) && site.id === selected.id}
                                    onClick={(s) => {
                                        setSelected(s)
                                        if (opened) setOpened(false)
                                    }}
                                />
                            ))}
                        </Navbar.Section>
                    </Navbar>
                }
                header={
                    <Header
                        p="sm"
                        height={60}
                        sx={(theme) => ({ border: 0 })}
                    >
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'relative',
                                flexGrow: 1,
                            }}
                        >
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    size="sm"
                                    opened={opened}
                                    onClick={() => setOpened((prev) => !prev)}
                                />
                            </MediaQuery>
                            <Image src="/cyse.svg" alt="CySe Logo" height={38} />
                            <ActionIcon
                                size="lg"
                                radius="xl"
                                color="gray"
                                variant="light"
                                component="a"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://github.com/fehawen/cyse"
                            >
                                <BrandGithub size={20} />
                            </ActionIcon>
                        </Box>
                    </Header>
                }
            >
                {renderContent()}
                {(!error && !opened && data) && (
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Affix position={{ bottom: 24, right: 24 }}>
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                color="grape"
                                variant="filled"
                                onClick={() => setSelected(randomFeed())}
                            >
                                <ArrowsShuffle size={20} strokeWidth={2} />
                            </ActionIcon>
                        </Affix>
                    </MediaQuery>
                )}
            </AppShell>
        </>
    )
}
