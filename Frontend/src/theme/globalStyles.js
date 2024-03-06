// @mui
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const inputGlobalStyles = (
    <MUIGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        ul: {
          margin: 0,
          padding: 0,
        },
        // Quill Text Editor
        '.quill': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
        '.ql-container': {
          borderTop: '1px solid #ccc !important',
          borderBottom: '1px solid #ccc  !important',
          // height: '92%',
        },
        '.ql-toolbar': {
          display: 'inline-flex',
          order: 2,
          padding: '0 !important',
          alignItems: 'center',
          // height: '8%',
        },
        '.ql-editor': {
          fontSize: '1.4em',
        },
        '.custom-quill .ql-container': {
          borderTop: '1px solid #ccc !important',
          borderBottom: '1px solid #ccc !important',
          height: '90% !important',
        },

        '.custom-quill .ql-toolbar': {
          display: 'inline-flex',
          order: 2,
          padding: '0 !important',
          alignItems: 'center',
          height: '10% !important',
        },
        '.MuiDataGrid-root ,.MuiDataGrid-cell:focus-within': {
          outline: 'none !important',
        },
        // React Calender
        '.react-calendar': {
          border: 'none',
        },
        // '.react-calendar button': {
        //   borderRadius: '50%',
        // },
        '.react-calendar__tile--now': {
          background: 'transparent',
        },
        '.react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus': {
          background: '#e6e6e6 !important',
        },
        '.react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus': {
          background: '#1087ff !important',
        },
        '.react-calendar__tile--active': {
          background: '#006edc !important',
        },
        '.MuiGrid-item': {
          paddingTop: '0 !important',
        },

        // BeeFree
        '#bee-plugin-container': {
          height: '100%',
        },

        '.nl-container': {
          display: 'flex',
          justifyContent: 'center',
        },
        '.simple-email-editor p': {
          lineHeight: 1.5,
          lineBreak: 'anywhere',
          padding: '0 !important',
          margin: '0 !important',
        },
        '.Alertbar': {
          color: 'black !important',
          backgroundColor: 'white !important',
        },
        '.css-1ytlwq5-MuiAlert-icon,.css-1pxa9xg-MuiAlert-message': {
          padding: '3px 0px !important',
        },
        '.css-1ateqvz-MuiPaper-root-MuiAlert-root': {
          borderRadius: '6px !important',
        },
      }}
    />
  );

  return inputGlobalStyles;
}
