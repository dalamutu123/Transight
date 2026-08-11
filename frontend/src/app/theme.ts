import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#540D6E', // Royal Purple - primary actions, active states
    },
    secondary: {
      main: '#111344', // Midnight Blue - navigation, sidebar, headings
    },
    background: {
      default: '#F5F7FA', // Slate Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937', // Charcoal
      secondary: '#6B7280', // Cool Gray
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#3B82F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Manrope", ui-sans-serif, system-ui, sans-serif',
  },
  shape: {
    borderRadius: 10, // per brand doc: rounded corners 10-12px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // enterprise UI convention, not shouty all-caps buttons
        },
      },
    },
  },
});