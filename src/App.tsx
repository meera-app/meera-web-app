
import './App.css';
import { AppBar, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme/theme';
import { UserProvider } from './util/Auth';
import HomePage from './pages/HomePage';
import DeleteAccount from './pages/DeleteAccount';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}>
        <UserProvider>
          {/* <AppBar component="nav" color='transparent'>
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                MUI
              </Typography>
            </Toolbar>
          </AppBar> */}
          {/* <DeleteAccount /> */}
          <HomePage />
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
