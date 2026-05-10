import type { PropsWithChildren, ReactElement } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type AppShellProps = PropsWithChildren<{
    eyebrow: string;
    title: string;
    description: string;
}>;

export function AppShell({ eyebrow, title, description, children }: AppShellProps): ReactElement {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                px: { xs: 2, md: 4 },
                py: { xs: 3, md: 5 },
            }}
        >
            <Box
                sx={{
                    mx: 'auto',
                    maxWidth: 1080,
                    border: '1px solid var(--line)',
                    borderRadius: 6,
                    backgroundColor: 'var(--surface)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: 'var(--shadow)',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2.5, md: 4 },
                        py: { xs: 3, md: 4 },
                        borderBottom: '1px solid var(--line)',
                        background: 'linear-gradient(135deg, rgba(20, 99, 86, 0.1), rgba(248, 196, 113, 0.14))',
                    }}
                >
                    <Stack spacing={2}>
                        <Chip
                            label={eyebrow}
                            sx={{
                                alignSelf: 'flex-start',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                bgcolor: 'var(--accent-soft)',
                                color: 'var(--accent)',
                                fontWeight: 700,
                            }}
                        />
                        <Stack spacing={1}>
                            <Typography variant="h1">{title}</Typography>
                            <Typography variant="body1" sx={{ maxWidth: 640, color: 'var(--muted)' }}>
                                {description}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 } }}>{children}</Box>
            </Box>
        </Box>
    );
}
