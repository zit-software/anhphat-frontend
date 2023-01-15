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
            initialValues={{
                ten: user.ten,
                mk: '',
                cfmk: '',
                laAdmin: user.laAdmin,
                sdt: user.sdt || ''
            }}
            validationSchema={Yup.object().shape({
                ten: Yup.string().required('Vui lòng nhập tên'),
                mk: requiredPassword
                    ? Yup.string().required('Vui lòng nhập mật khẩu')
                    : Yup.string(),
                cfmk: requiredPassword
                    ? Yup.string()
                          .required('Vui lòng nhập lại mật khẩu')
                          .equals([Yup.ref('mk')], 'Mật khẩu nhập lại không khớp')
                    : Yup.string().equals([Yup.ref('mk')], 'Mật khẩu nhập lại không khớp'),
                laAdmin: Yup.boolean(),
                sdt: Yup.string()
                    .nullable()
                    .test(
                        'len',
                        'Số điện thoại có độ dài trong 6 đến 11 số',
                        (v) => !v || (v.length >= 6 && v.length <= 11)
                    )
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form noValidate style={{ padding: 20 }} onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.ten}>
                        <InputLabel htmlFor="ten">Tên nhân viên</InputLabel>
                        <OutlinedInput
                            id="ten"
                            name="ten"
                            label="Tên nhân viên"
                            placeholder="Nguyễn Văn A"
                            autoComplete="name"
                            value={values.ten}
                            onChange={handleChange}
                        />
                        <FormHelperText error>{errors.ten}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.sdt}>
                        <InputLabel htmlFor="sdt">Số điện thoại</InputLabel>
                        <OutlinedInput
                            id="sdt"
                            name="sdt"
                            label="Số điện thoại"
                            placeholder="0123456789"
                            autoComplete="tel"
                            value={values.sdt}
                            onChange={handleChange}
                        />
                        <FormHelperText error>{errors.sdt}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="mk">Mật khẩu</InputLabel>
                        <OutlinedInput
                            id="mk"
                            name="mk"
                            label="Mật khẩu"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            autoComplete="new-password"
                            value={values.mk}
                            error={!!errors.mk}
                            onChange={handleChange}
                        />
                        <FormHelperText error>{errors.mk}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="cfmk">Xác nhận mật khẩu</InputLabel>
                        <OutlinedInput
                            id="cfmk"
                            name="cfmk"
                            label="Xác nhận mật khẩu"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Xác nhận mật khẩu"
                            value={values.cfmk}
                            error={!!errors.cfmk}
                            onChange={handleChange}
                        />

                        <FormHelperText error>{errors.cfmk}</FormHelperText>
                    </FormControl>

                    <FormControlLabel
                        label="Tài khoản quản trị"
                        control={<Checkbox />}
                        name="laAdmin"
                        checked={values.laAdmin}
                        onChange={handleChange}
                    />
                    <FormHelperText error>{errors.laAdmin}</FormHelperText>

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
