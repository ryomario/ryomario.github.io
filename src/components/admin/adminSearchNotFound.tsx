import Box, { BoxProps } from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

type Props = BoxProps & {
  query?: string;
  sx?: SxProps<Theme>;
  slotProps?: {
    title?: TypographyProps;
    description?: TypographyProps;
  };
};

export function AdminSearchNotFound({ query, sx, slotProps, ...rest }: Props) {
  if(!query) {
    return (
      <Typography variant="body2" {...slotProps?.description}>
        Please enter keywords
      </Typography>
    );
  }

  return (
    <Box
      sx={[
        {
          gap: 1,
          display: 'flex',
          borderRadius: 1.5,
          textAlign: 'center',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <Typography
        variant="h6"
        {...slotProps?.title}
        sx={[
          { color: 'text.primary' },
          ...(Array.isArray(slotProps?.title?.sx) ? (slotProps?.title?.sx ?? []) : [slotProps?.title?.sx]),
        ]}
      >
        Not Found
      </Typography>

      <Typography variant="body2" {...slotProps?.description}>
        No results found for &nbsp;
        <strong>{`"${query}"`}</strong>
        .
        <br /> Try checking for typos or using complete words.
      </Typography>
    </Box>
  );
}