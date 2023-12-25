
import './App.css';
import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme/theme';
import { UserProvider } from './util/Auth';
import HomePage from './pages/HomePage';
import { auth } from './firebase/firebase';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}>
        <UserProvider>
          <HomePage />
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
