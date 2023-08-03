import { useSelector } from 'react-redux';

import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import 'dayjs/locale/vi';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import AuthService from 'services/auth.service';
import { store } from 'store';
import { setUser } from 'store/actions';

import { QueryClientProvider } from 'react-query';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import queryClient from 'views/utilities/queryClient';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    const navigator = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await AuthService.auth();
                store.dispatch(setUser(res.data));
            } catch (error) {
                navigator('/auth/login');
            }
        };

        fetchData();
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                    <QueryClientProvider client={queryClient}>
                        <CssBaseline />
                        <NavigationScroll>
                            <Routes />
                        </NavigationScroll>
                    </QueryClientProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
