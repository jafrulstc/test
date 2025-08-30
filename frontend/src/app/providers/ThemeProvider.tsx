import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { blue, teal, red, amber, green, orange, grey } from '@mui/material/colors';
import { THEME_CONSTANTS } from '~/app/constants';

type ThemeMode = typeof THEME_CONSTANTS.MODES[number];

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom hook to access theme context
 * @throws {Error} When used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider component that manages application theme state
 * and provides Material-UI theme configuration
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(THEME_CONSTANTS.STORAGE_KEY);
    return (savedMode as ThemeMode) || 'light';
  });

  /**
   * Toggle between light and dark theme modes
   */
  const toggleTheme = (): void => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Persist theme mode to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_CONSTANTS.STORAGE_KEY, mode);
  }, [mode]);

  /**
   * Create Material-UI theme based on current mode
   */
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? blue[600] : blue[400],
        light: mode === 'light' ? blue[400] : blue[300],
        dark: mode === 'light' ? blue[800] : blue[600],
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? teal[500] : teal[400],
        light: mode === 'light' ? teal[300] : teal[200],
        dark: mode === 'light' ? teal[700] : teal[600],
      },
      error: {
        main: mode === 'light' ? red[600] : red[400],
        light: mode === 'light' ? red[400] : red[300],
        dark: mode === 'light' ? red[800] : red[600],
      },
      warning: {
        main: mode === 'light' ? amber[600] : amber[400],
        light: mode === 'light' ? amber[400] : amber[300],
        dark: mode === 'light' ? amber[800] : amber[600],
      },
      success: {
        main: mode === 'light' ? green[600] : green[400],
        light: mode === 'light' ? green[400] : green[300],
        dark: mode === 'light' ? green[800] : green[600],
      },
      info: {
        main: mode === 'light' ? orange[600] : orange[400],
        light: mode === 'light' ? orange[400] : orange[300],
        dark: mode === 'light' ? orange[800] : orange[600],
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? grey[900] : grey[100],
        secondary: mode === 'light' ? grey[700] : grey[300],
      },
      divider: mode === 'light' ? grey[200] : grey[700],
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h5: {
        fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01071em',
      },
      button: {
        fontWeight: 600,
        letterSpacing: '0.02857em',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: mode === 'light' ? '#cbd5e1 #f1f5f9' : '#475569 #1e293b',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#f1f5f9' : '#1e293b',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? '#cbd5e1' : '#475569',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: mode === 'light' ? '#94a3b8' : '#64748b',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' ? '0px 20px 40px rgba(0, 0, 0, 0.1)' : '0px 20px 40px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'light' ? blue[400] : blue[300],
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: 2,
                },
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            color: mode === 'light' ? grey[900] : grey[100],
            boxShadow: mode === 'light' 
              ? '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)'
              : '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.24)',
            backdropFilter: 'blur(8px)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            borderRight: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '4px 8px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: mode === 'light' ? blue[50] : blue[900],
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              backgroundColor: `${blue[600]} !important`,
              color: '#ffffff',
              '&:hover': {
                backgroundColor: `${blue[700]} !important`,
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: mode === 'light' 
              ? '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' 
              : '0px 25px 50px -12px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
  });

  const contextValue: ThemeContextValue = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};