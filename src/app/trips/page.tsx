import type { ReactElement } from 'react';

import Stack from '@mui/material/Stack';

import { AppShell } from '@/components/app/app-shell';
import { PlaceholderPanel } from '@/components/app/placeholder-panel';

export default function TripsPage(): ReactElement {
    return (
        <AppShell
            eyebrow="Trips"
            title="Your trip workspace starts here."
            description="This route is intentionally a placeholder. Listing trips, creating trips, and joining by code are separate issues."
        >
            <Stack spacing={2.5}>
                <PlaceholderPanel
                    label="Route"
                    title="/trips"
                    body="Future work will load the current user's trips after the session and trip APIs exist."
                />
                <PlaceholderPanel
                    label="Not Yet"
                    title="No trip actions in this issue"
                    body="Create Trip, Join Trip, and Trip cards are explicitly deferred to later issues."
                />
            </Stack>
        </AppShell>
    );
}
