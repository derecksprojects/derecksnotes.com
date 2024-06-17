'use client';
// https://github.com/vercel/next.js/issues/49850
import './globals.css';
import { ThemeProvider } from 'styled-components';
import { theme } from '@components/styles/theme';

import StyledComponentsRegistry from '@components/lib/registry';
import GlobalStyles from '@components/styles/GlobalStyles';
import Logo from '@components/components/ui/Logo';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
                <html lang="en">
                    <body>
                        <GlobalStyles />
                        <Logo />
                        {children}
                        {/* <Footer /> */}
                    </body>
                </html>
            </ThemeProvider>
        </StyledComponentsRegistry>
    );
}
