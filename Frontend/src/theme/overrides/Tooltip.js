// ----------------------------------------------------------------------

export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800],
          padding: '1.5rem 1rem',
          fontSize: '0.8rem',
        },
        arrow: {
          color: theme.palette.grey[800],
        },
      },
    },
  };
}
