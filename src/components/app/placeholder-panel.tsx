import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type PlaceholderPanelProps = {
  label: string;
  title: string;
  body: string;
};

export function PlaceholderPanel({
  label,
  title,
  body,
}: PlaceholderPanelProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid var(--line)",
        backgroundColor: "var(--surface-strong)",
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          variant="overline"
          sx={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}
        >
          {label}
        </Typography>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="body2" sx={{ color: "var(--muted)" }}>
          {body}
        </Typography>
      </Stack>
    </Box>
  );
}
