import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import '../styles/fonts.css'

export default function App(props) {
    const { Component, pageProps } = props

    return (
        <>
            <Head>
                <title>CySe</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'light',
                    fontFamily: 'Fira Sans, sans-serif',
                    headings: { fontFamily: 'Oswald, sans-serif' },
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </>
    )
}
