import type { ReactElement, ReactNode } from 'react';

import type { Metadata } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';

import { MuiProvider } from '@/components/base/mui-provider';

import './globals.css';

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
    variable: '--font-ibm-plex-mono',
    subsets: ['latin'],
    weight: ['400', '700'],
});

export const metadata: Metadata = {
    title: 'Split Bill & Tracking',
    description: 'Shared trip expense tracking for MVP V0.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): ReactElement {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
                <MuiProvider>{children}</MuiProvider>
            </body>
        </html>
    );
}
