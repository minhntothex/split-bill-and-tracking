import type { ReactElement } from 'react';

import Grid from '@mui/material/Grid';

import { AppShell } from '@/components/app/app-shell';
import { PlaceholderPanel } from '@/components/app/placeholder-panel';

export default function HomePage(): ReactElement {
    return (
        <AppShell
            eyebrow="MVP V0"
            title="Split trips before the spreadsheet gets ugly."
            description="This placeholder screen marks the app entry point for user setup. Session, trip, and billing behavior stay out of scope for issue #1."
        >
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <PlaceholderPanel
                        label="Route"
                        title="/"
                        body="Reserved for lightweight user setup in a later issue."
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <PlaceholderPanel
                        label="Scope Guard"
                        title="Foundation only"
                        body="This scaffold provides layout, theme, and navigation targets without introducing MVP feature logic."
                    />
                </Grid>
            </Grid>
        </AppShell>
    );
}
