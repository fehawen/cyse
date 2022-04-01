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
    Grid,
    Group,
    Header,
    Image,
    Loader,
    LoadingOverlay,
    MediaQuery,
    Navbar,
    ScrollArea,
    Text,
    Title,
    ThemeIcon
} from '@mantine/core'
import {
    AlertCircle,
    BrandGithub,
    ChevronLeft,
    ChevronRight,
    RotateDot,
    Rss
} from 'tabler-icons-react'
import { sites } from '../data/sites'

const fetcher = (url) => fetch(url).then((res) => res.json())
const options = { refreshInterval: 900000 }

function randomFeed() {
    const index = Math.floor(Math.random() * (sites.length - 1))
    return sites[index]
}

function sortSites() {
    return sites.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
}

export default function Index() {
    const [posts, setPosts] = useState([])
    const [selected, setSelected] = useState(randomFeed())
    const [opened, setOpened] = useState(false)
    const { data, error } = useSwr(`/api/feed/${selected.id}`, fetcher, options)

    useEffect(() => {
        if (data && data.posts) {
            setPosts(data.posts)
        }
    }, [data])

    function viewPrev() {
        const index = sites.findIndex((site) => site.id === selected.id)
        const prev = index <= 0
            ? sites[sites.length - 1]
            : sites[index - 1]

        setSelected(prev)
    }

    function viewNext() {
        const index = sites.findIndex((site) => site.id === selected.id)
        const next = index >= sites.length - 1
            ? sites[0]
            : sites[index + 1]

        setSelected(next)
    }

    function renderContent() {
        if (error) {
            return (
                <Center style={{ height: '100%' }}>
                    <Alert
                        p="xl"
                        color="red"
                        radius="lg"
                        title="Something went wrong"
                        icon={<AlertCircle size={30} />}
                        styles={(theme) => ({
                            light: { backgroundColor: theme.colors.dark[4] },
                            message: { color: theme.colors.dark[1] }
                        })}
                    >
                        The selected RSS feed failed to respond.
                        <Box mt="xl">
                            <Button
                                fullWidth
                                radius="lg"
                                color="dark"
                                variant="white"
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
                    <Loader size="xl" variant="dots" color="white" />
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
                        radius="lg"
                        title={selected.name}
                        styles={(theme) => ({
                            light: { color: theme.colors.dark[0], backgroundColor: theme.colors.dark[4] },
                            message: { color: theme.colors.dark[1] }
                        })}
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
                <title>CySe</title>
                <meta name="description" content="Cyber Security RSS Feeds" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppShell
                fixed
                navbarOffsetBreakpoint="sm"
                navbar={
                    <Navbar
                        p="xs"
                        hidden={!opened}
                        hiddenBreakpoint="sm"
                        sx={(theme) => ({
                            border: 0,
                            backgroundColor: theme.colors.dark[6],
                        })}
                        width={{ sm: 250 }}
                    >
                        <LoadingOverlay
                            visible={!data}
                            loader={<div />}
                            sx={(theme) => ({ borderTopRightRadius: theme.radius.lg })}
                        />
                        <Divider
                            my="xs"
                            label={
                                <>
                                    <ThemeIcon
                                        radius="xl"
                                        color="dark"
                                        variant="light"
                                        sx={(theme) => ({
                                            backgroundColor: theme.colors.dark[4],
                                        })}
                                    >
                                        <Rss size={12} strokeWidth={3} />
                                    </ThemeIcon>
                                    <Box ml="xs" sx={{ fontWeight: 'bold' }}>
                                        RSS Feeds
                                    </Box>
                                </>
                            }
                        />
                        <Navbar.Section
                            grow
                            offsetScrollbars
                            scrollbarSize={5}
                            component={ScrollArea}
                            mx="-xs"
                            px="xs"
                            pl={0}
                        >
                            {sortSites().map((site) => (
                                <NavbarItem
                                    key={site.id}
                                    site={site}
                                    error={false}
                                    active={Boolean(data) && site.id === selected.id}
                                    onClick={(s) => setSelected(s)}
                                />
                            ))}
                        </Navbar.Section>
                    </Navbar>
                }
                header={
                    <Header
                        p="md"
                        height={60}
                        sx={(theme) => ({
                            backgroundColor: theme.colors.dark[6],
                            border: 0,
                        })}
                    >
                        <Box style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    mr="xl"
                                    size="sm"
                                    opened={opened}
                                    onClick={() => setOpened((prev) => !prev)}
                                />
                            </MediaQuery>

                            <Box
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    flexGrow: 1,
                                }}
                            >
                                <Image src="/cyse.svg" alt="CySe Logo" width={40} height={40} />
                                <ActionIcon
                                    size="lg"
                                    radius="xl"
                                    variant="transparent"
                                    component="a"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://github.com/fehawen/cyse"
                                    sx={(theme) => ({
                                        transition: 'all 0.1s ease-in-out 0s',
                                        color: theme.colors.dark[2],

                                        '&:hover': {
                                            backgroundColor: theme.colors.dark[4],
                                        }
                                    })}
                                >
                                    <BrandGithub size={20} />
                                </ActionIcon>
                            </Box>
                        </Box>
                    </Header>
                }
                sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}>
                {renderContent()}
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Affix position={{ bottom: 10, right: 10 }}>
                        <Group
                            p={5}
                            spacing="md"
                            sx={(theme) => ({
                                backgroundColor: 'rgba(40, 36, 61, 0.6)',
                                borderRadius: theme.radius.xl,
                            })}
                        >
                            <ActionIcon
                                radius="xl"
                                color="dark"
                                onClick={viewPrev}
                                sx={(theme) => ({
                                    color: theme.colors.dark[1],
                                    backgroundColor: 'rgba(53, 49, 78, 0.3)',
                                })}
                            >
                                <ChevronLeft size={18} />
                            </ActionIcon>
                            <ActionIcon
                                radius="xl"
                                color="dark"
                                onClick={viewNext}
                                sx={(theme) => ({
                                    color: theme.colors.dark[1],
                                    backgroundColor: 'rgba(53, 49, 78, 0.3)',
                                })}
                            >
                                <ChevronRight size={18} />
                            </ActionIcon>
                        </Group>
                    </Affix>
                </MediaQuery>
            </AppShell>
        </>
    )
}
