import useSwr from 'swr'
import Head from 'next/head'
import NavbarItem from '../components/NavbarItem'
import PostCard from '../components/PostCard'
import useInstallAppPrompt from '../hooks/useInstallAppPrompt'
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
    Paper,
    ScrollArea,
    Text,
    Title,
    ThemeIcon
} from '@mantine/core'
import {
    AlertCircle,
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
    const [showPrompt, setShowPrompt] = useState(false)
    const [promptEvent, promptInstall] = useInstallAppPrompt()
    const { data, error } = useSwr(`/api/feed/${selected.id}`, fetcher, options)

    useEffect(() => {
        if (data && data.posts) {
            setPosts(data.posts)
        }
    }, [data])

    useEffect(() => {
        if (promptEvent) setShowPrompt(true)
    }, [promptEvent])

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
                                radius="xl"
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
                sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}
                navbar={
                    <Navbar
                        p="sm"
                        hidden={!opened}
                        hiddenBreakpoint="sm"
                        sx={(theme) => ({
                            border: 0,
                            backgroundColor: theme.colors.dark[6],
                        })}
                        width={{ sm: 280 }}
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
                            mx="-sm"
                            px="xs"
                            pl={0}
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
                        sx={(theme) => ({
                            backgroundColor: theme.colors.dark[6],
                            border: 0,
                        })}
                    >
                        <Box style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    mr="md"
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
                                <Image src="/cyse.svg" alt="CySe Logo" width={35} height={35} />
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
            >
                {renderContent()}
                {showPrompt && (
                    <Affix position={{ bottom: 16, right: 16 }}>
                        <Paper
                            px="xl"
                            py="sm"
                            radius="lg"
                            shadow="lg"
                            sx={(theme) => ({
                                backgroundColor: theme.colors.dark[0],
                            })}
                        >
                            <Group spacing="sm">
                                <Button
                                    radius="xl"
                                    leftIcon={<CloudDownload size={20} />}
                                    onClick={() => promptInstall()}
                                >
                                    Install App
                                </Button>
                                <ActionIcon
                                    size="lg"
                                    color="red"
                                    radius="xl"
                                    variant="filled"
                                    onClick={() => setShowPrompt(false)}
                                >
                                    <X size={20} />
                                </ActionIcon>
                            </Group>
                        </Paper>
                    </Affix>
                )}
                {(!error && !opened && !showPrompt && data) && (
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Affix position={{ bottom: 16, right: 16 }}>
                            <ActionIcon
                                size="xl"
                                radius="lg"
                                color="dark"
                                onClick={() => setSelected(randomFeed())}
                                sx={(theme) => ({
                                    color: theme.colors.green[5],
                                    backgroundColor: 'rgba(40, 36, 61, 0.75)',
                                })}
                            >
                                <ArrowsShuffle size={20} />
                            </ActionIcon>
                        </Affix>
                    </MediaQuery>
                )}
            </AppShell>
        </>
    )
}
