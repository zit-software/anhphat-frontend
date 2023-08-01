import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormHelperText,
    Toolbar,
    useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import * as Yup from 'yup';

// project imports
import navigation from 'menu-items';
import { SET_MENU, setPin } from 'store/actions';
import { drawerWidth } from 'store/constant';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';

// assets
import { IconChevronRight } from '@tabler/icons';
import { Formik } from 'formik';
import { Toaster } from 'react-hot-toast';
import PinInput from 'react-pin-input';
import AuthService from 'services/auth.service';
import accessToken from 'utils/access-token';

// styles
const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`,
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px',
        },
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
        },
    }),
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const pin = useSelector((state) => state.auth.pin);
    const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        dispatch({
            type: SET_MENU,
            opened: !leftDrawerOpened,
        });
    };

    useEffect(() => {
        dispatch({ type: SET_MENU, opened: !matchDownMd });
    }, [matchDownMd]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened ? theme.transitions.create('width') : 'none',
                    zIndex: leftDrawerOpened ? theme.zIndex.drawer : theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            {/* drawer */}
            <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

            {/* main content */}
            <Main theme={theme} open={leftDrawerOpened}>
                {/* breadcrumb */}
                <Breadcrumbs
                    separator={IconChevronRight}
                    navigation={navigation}
                    icon
                    title
                    rightAlign
                />
                <Outlet />
            </Main>

            <Dialog
                sx={{
                    backdropFilter: 'blur(20px)',
                }}
                open={!pin}
            >
                <Formik
                    initialValues={{
                        pin: '',
                    }}
                    validationSchema={Yup.object().shape({
                        pin: Yup.string()
                            .length(6, 'Độ dài mã pin là 6')
                            .required('Vui lòng nhập mã pin'),
                    })}
                    onSubmit={async (values) => {
                        try {
                            await AuthService.kiemtrapin(values);
                            dispatch(setPin(values.pin));
                        } catch (error) {
                            alert(error.response?.data.message);
                        }
                    }}
                >
                    {({ errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle>Mã pin</DialogTitle>
                            <DialogContent>
                                <p>Vui lòng nhập mã pin để tiếp tục</p>
                                <PinInput
                                    length={6}
                                    type="numeric"
                                    secret
                                    autoSelect
                                    focus
                                    inputStyle={{
                                        borderRadius: 10,
                                        borderColor: errors.pin ? 'red' : '#ddd',
                                    }}
                                    onChange={(value) => {
                                        handleChange({
                                            target: { name: 'pin', value },
                                        });
                                    }}
                                />

                                <FormHelperText error={!!errors.pin}>{errors.pin}</FormHelperText>

                                <Button
                                    sx={{ mt: 2, mb: 2 }}
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                >
                                    Xác nhận
                                </Button>
                                <Divider>Hoặc</Divider>
                                <Button
                                    type="button"
                                    fullWidth
                                    onClick={() => {
                                        accessToken.set('');
                                        window.location = '/auth/login';
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </DialogContent>
                        </form>
                    )}
                </Formik>
            </Dialog>

            <Toaster />
        </Box>
    );
};

export default MainLayout;
