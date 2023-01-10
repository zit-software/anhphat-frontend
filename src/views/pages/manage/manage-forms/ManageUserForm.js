import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ManageUserForm = ({
    user = {},
    buttonText = 'Lưu',
    requiredPassword = false,
    onSubmit = (values) => values
}) => {
    return (
        <Formik
            initialValues={{ ten: user.ten, mk: '', cfmk: '', laAdmin: user.laAdmin }}
            validationSchema={Yup.object().shape({
                ten: Yup.string().required('Vui lòng nhập tên'),
                mk: requiredPassword
                    ? Yup.string().required('Vui lòng nhập mật khẩu')
                    : Yup.string(),
                cfmk: Yup.string().oneOf([Yup.ref('mk'), null], 'Mật khẩu nhập lại không khớp'),
                laAdmin: Yup.boolean()
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form noValidate style={{ padding: 20 }} onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.ten}>
                        <InputLabel htmlFor="ten">Tên</InputLabel>
                        <OutlinedInput
                            id="ten"
                            name="ten"
                            label="Tên"
                            placeholder="Nhập tên nhân viên"
                            value={values.ten}
                            onChange={handleChange}
                        />
                        {errors.ten && <FormHelperText error>{errors.ten}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="mk">Mật khẩu</InputLabel>
                        <OutlinedInput
                            id="mk"
                            name="mk"
                            label="Mật khẩu"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={values.mk}
                            error={!!errors.mk}
                            onChange={handleChange}
                        />
                        {errors.mk && <FormHelperText error>{errors.mk}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="cfmk">Xác nhận mật khẩu</InputLabel>
                        <OutlinedInput
                            id="cfmk"
                            name="cfmk"
                            label="Xác nhận mật khẩu"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={values.cfmk}
                            error={!!errors.cfmk}
                            onChange={handleChange}
                        />

                        {errors.cfmk && <FormHelperText error>{errors.cfmk}</FormHelperText>}
                    </FormControl>

                    <FormControlLabel
                        label="Tài khoản quản trị"
                        control={<Checkbox />}
                        name="laAdmin"
                        checked={values.laAdmin}
                        onChange={handleChange}
                    />
                    {errors.laAdmin && <FormHelperText error>{errors.laAdmin}</FormHelperText>}

                    <Divider />

                    <Button style={{ marginTop: 10 }} type="submit" variant="outlined">
                        {buttonText}
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default ManageUserForm;
