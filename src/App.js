import { useSelector } from 'react-redux';

import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

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

import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <QueryClientProvider client={queryClient}>
                    <CssBaseline />
                    <NavigationScroll>
                        <Routes />
                    </NavigationScroll>
                </QueryClientProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
