import Grid from "@mui/material/Grid";

import { AppShell } from "@/components/app/app-shell";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";

type TripDetailPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripDetailPage({
  params,
}: TripDetailPageProps) {
  const { tripId } = await params;

  return (
    <AppShell
      eyebrow="Trip Detail"
      title={`Trip ${tripId}`}
      description="This placeholder preserves the planned route shape for trip detail without implementing any protected trip data yet."
    >
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PlaceholderPanel
            label="Members"
            title="Trip detail shell"
            body="Later issues will load trip metadata and active members for authorized users."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PlaceholderPanel
            label="Future Sections"
            title="Bills, balance, owes-who, settlements"
            body="These sections are placeholders only. No API calls or business logic are introduced here."
          />
        </Grid>
      </Grid>
    </AppShell>
  );
}
