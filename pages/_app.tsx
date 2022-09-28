import * as React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider, EmotionCache} from '@emotion/react';
import themeCreator from '../src/themeCreator';
import createEmotionCache from '../src/createEmotionCache';
import {useMediaQuery} from "@mui/material";
import ContainerDrawer from "../src/ContainerDrawer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => themeCreator(prefersDarkMode), [prefersDarkMode]);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <title>OpenCraft</title>
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <ContainerDrawer>
                    <Container maxWidth="lg">
                        <Component {...pageProps} />
                    </Container>
                </ContainerDrawer>
            </ThemeProvider>
        </CacheProvider>
    );
}
