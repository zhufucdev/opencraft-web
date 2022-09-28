import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const primaryColor = '#039be5';

// To create a theme instance.
const themeCreator = (dark: boolean) => createTheme({
  palette: {
    mode: dark ? "dark" : "light",
    primary: {
      main: '#039be5',
    },
    secondary: {
      main: '#FF5722',
    },
    error: {
      main: red.A400,
    },
  },
});

export default themeCreator;
