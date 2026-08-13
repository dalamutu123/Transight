import { Box, CircularProgress } from '@mui/material';

export function PageLoader() {
  return (
    <Box className="flex items-center justify-center min-h-75">
      <CircularProgress color="secondary" size={32} />
    </Box>
  );
}