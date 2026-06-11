import { createTheme } from '@mui/material/styles';

// Bright, Happy & Modern Theme Palette
// Primary: Violet/Indigo (#4F46E5) | Secondary: Cherry/Hot Pink (#EC4899) | Info: Sky Blue (#0EA5E9)
// Success: Emerald (#10B981) | Warning: Gold/Amber (#F59E0B)

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#4F46E5',       // Vibrant Indigo
        light: '#6366F1',
        dark: '#4338CA',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#EC4899',       // Hot Pink
        light: '#F472B6',
        dark: '#DB2777',
        contrastText: '#ffffff',
      },
      info: {
        main: '#0EA5E9',       // Sky Blue
        light: '#38BDF8',
        dark: '#0284C7',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#0F172A' : '#F8FAFC',  // Sleek Slate vs Bright Soft Blue/Slate
        paper: mode === 'dark' ? '#1E293B' : '#ffffff',
        glass: mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.85)',
      },
      text: {
        primary: mode === 'dark' ? '#F8FAFC' : '#0F172A',
        secondary: mode === 'dark' ? '#94A3B8' : '#475569',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
      },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.06)',
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontSize: '1.25rem', fontWeight: 700 },
      h5: { fontSize: '1.125rem', fontWeight: 700 },
      h6: { fontSize: '1rem', fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 22px',
            fontSize: '0.875rem',
            fontWeight: 700,
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: 'none',
              transform: 'translateY(-1px) scale(1.03)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338CA 0%, #0284C7 100%)',
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #EC4899 0%, #D946EF 100%)',
            boxShadow: '0 4px 14px rgba(236, 72, 153, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #DB2777 0%, #C084FC 100%)',
              boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 20,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            boxShadow: mode === 'dark'
              ? '0 10px 30px rgba(0,0,0,0.4), 0 1px 4px rgba(255,255,255,0.02)'
              : '0 10px 35px rgba(79, 70, 229, 0.05), 0 1px 4px rgba(0,0,0,0.01)',
            border: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(79, 70, 229, 0.08)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'dark'
                ? '0 20px 40px rgba(0,0,0,0.55), 0 0 0 2px rgba(99, 102, 241, 0.2)'
                : '0 20px 40px rgba(79, 70, 229, 0.12), 0 0 0 2px rgba(79, 70, 229, 0.1)',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)',
            padding: '16px 20px',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: mode === 'dark' ? '#94A3B8' : '#475569',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.MuiTableRow-hover:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.08) !important' : 'rgba(79, 70, 229, 0.04) !important',
              transform: 'translateY(-1px) scale(1.002)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            borderRadius: 8,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            height: 10,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          },
          bar: {
            borderRadius: 8,
            background: 'linear-gradient(90deg, #4F46E5 0%, #0EA5E9 100%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
            transition: 'box-shadow 0.2s ease-in-out',
            backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
          },
        },
      },
    },
  });
