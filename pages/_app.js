import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import '../styles/fonts.css'

const theme = {
    colorScheme: 'dark',
    colors: {
        dark: [
            'rgba(231, 227, 252, 0.87)',
            'rgba(231, 227, 252, 0.68)',
            'rgba(231, 227, 252, 0.38)',
            '#3d3759',
            '#35314e',
            '#312d4b',
            ...Array(4).fill('#28243d')
        ]
    },
    fontFamily: 'Kanit, sans-serif',
    headings: { fontFamily: 'Teko, sans-serif' },
}

export default function App(props) {
    const { Component, pageProps } = props

    return (
        <>
            <Head>
                <title>CySe</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, viewport-fit=cover"
                />
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={theme}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </>
    )
}
