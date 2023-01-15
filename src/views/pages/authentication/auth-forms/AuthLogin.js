import { useState } from 'react';

// material-ui
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthService from 'services/auth.service';
import accessToken from 'utils/access-token';

import config from '../../../../config';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
    const theme = useTheme();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}></Grid>

            <Formik
                initialValues={{
                    ma: '',
                    matkhau: '',
                    submit: null,
                }}
                validationSchema={Yup.object().shape({
                    ma: Yup.string().max(255).required('Mã số là bắt buộc'),
                    matkhau: Yup.string().max(255).required('Mật khẩu là bắt buộc'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        const res = await AuthService.login(values);

                        accessToken.set(res.data.accessToken);

                        window.location = config.defaultPath;
                    } catch (err) {
                        setErrors({
                            submit: 'Tên đăng nhập hoặc mật khẩu không chính xác',
                        });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            sx={{
                                ...theme.typography.customInput,
                            }}
                        >
                            <InputLabel htmlFor="outlined-adornment-email-login">
                                Mã nhân viên
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="ma"
                                value={values.ma}
                                name="ma"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Mã nhân viên"
                                inputProps={{}}
                            />
                            {touched.ma && errors.ma && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.ma}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{
                                ...theme.typography.customInput,
                            }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">
                                Mật khẩu
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.matkhau}
                                name="matkhau"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Mật khẩu"
                                inputProps={{}}
                            />
                            {touched.matkhau && errors.matkhau && (
                                <FormHelperText
                                    error
                                    id="standard-weight-helper-text-password-login"
                                >
                                    {errors.matkhau}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSubmit}
                                >
                                    Đăng nhập
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
