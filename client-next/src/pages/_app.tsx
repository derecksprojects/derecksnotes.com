import React from 'react';
import { AppProps } from 'next/app';

// components
import NavBar from '@components/ui/NavBar';
import Logo from '@components/Logo';
import Footer from '@components/ui/Footer';

// styles
import GlobalStyles from '@styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from '@styles/theme';

import '@public/fonts/roboto.css'; // sans-serif
import '@public/fonts/tangerine.css'; // cursive
import '@public/fonts/fjalla_one.css'; // block letters; main logo

import '@styles/footnotes.css'; // markdown processed by @utils/markdown.ts


export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={ theme }>
            <GlobalStyles />
            <Logo></Logo>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </ThemeProvider>
    )
}
