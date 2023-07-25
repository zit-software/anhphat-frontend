import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import ProvinceService from 'services/province.service';
import * as Yup from 'yup';

function ManageNPPPointForm({ value = {}, buttonText, onSubmit, onClose }) {
    return (
        <Formik
            validateOnMount
            initialValues={{
                ma: value.ma || '',
                diem: value.diem >= 0 ? value.diem : '',
                ghichu: value.ghichu || '',
            }}
            validationSchema={Yup.object().shape({
                diem: Yup.number()
                    .required('Điểm không được trống')
                    .test(
                        'Điểm Hợp Lệ',
                        'Điểm của một nhà phân phối phải lớn hơn bằng 0',
                        (value) => value >= 0
                    ),
                ghichu: Yup.string().required('Ghi chú không được bỏ trống'),
            })}
            onSubmit={onSubmit}
            validateOnChange
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ padding: '10px 0' }}>
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            value={value.ten || ''}
                            label="Tên nhà phân phối"
                            focused={false}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            fullWidth
                            value={ProvinceService.findByCode(value.tinh || 92).name}
                            label="Tỉnh/ Thành Phố"
                            focused={false}
                            InputProps={{ readOnly: true }}
                            name="tinh"
                            autoComplete="tinh"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Điểm</InputLabel>
                            <OutlinedInput
                                value={values.diem || ''}
                                error={!!errors.diem}
                                label="Điểm Mới Của Nhà Phân Phối"
                                name="Diem"
                                autoComplete="off"
                                type="number"
                                endAdornment={<InputAdornment position="end">điểm</InputAdornment>}
                                onChange={(event) => {
                                    handleChange({
                                        target: {
                                            value: Number(event.target.value),
                                            name: 'diem',
                                        },
                                    });
                                }}
                            />
                            <FormHelperText error>{errors.diem}</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <TextField
                                fullWidth
                                value={values.ghichu || ''}
                                error={!!errors.ghichu}
                                label="Ghi chú thay đổi điểm"
                                placeholder="VD: Đổi quà cho nhà phân phối y tế 100 điểm"
                                name="ghichu"
                                onChange={(e) => {
                                    handleChange({
                                        target: {
                                            value: e.target.value,
                                            name: 'ghichu',
                                        },
                                    });
                                }}
                            />
                            <FormHelperText error>{errors.ghichu}</FormHelperText>
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit">
                            {buttonText || 'Thêm'}
                        </Button>

                        <Button color="primary" type="button" onClick={onClose}>
                            Hủy
                        </Button>
                    </Stack>
                </form>
            )}
        </Formik>
    );
}

export default ManageNPPPointForm;
