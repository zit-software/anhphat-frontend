import { TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import InputNumber from 'ui-component/input-number';
import * as Yup from 'yup';

const _initialValue = {
    ten: '',
    diem: 0,
    soluong: 0,
    gia: 0,
};

const validationSchema = Yup.object().shape({
    ten: Yup.string().required('Vui lòng nhập tên'),
    diem: Yup.number()
        .required('Vui lòng nhập điểm')
        .min(1, 'Điểm quy đổi phải lớn hơn 0')
        .integer('Điểm quy đổi phải là số nguyên'),
    soluong: Yup.number(),
    gia: Yup.number().min(0, 'Giá phải lớn hơn 0'),
});

const QuaKhuyenDungForm = ({ actions, initialValue = _initialValue, onSubmit }) => {
    return (
        <Formik
            initialValues={initialValue}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} py={2}>
                        <TextField
                            placeholder="Tự động tạo"
                            disabled
                            label="Mã (tự động tạo)"
                            name="ma"
                            value={values.ma}
                        />

                        <TextField
                            placeholder="Mũ bảo hiểm"
                            label="Tên"
                            name="ten"
                            autoFocus
                            error={!!errors.ten}
                            helperText={errors.ten}
                            value={values.ten}
                            onChange={handleChange}
                        />

                        <TextField
                            placeholder="Giá"
                            label="Giá"
                            name="gia"
                            autoFocus
                            error={!!errors.gia}
                            helperText={errors.gia}
                            value={values.gia}
                            InputProps={{
                                endAdornment: <span>đ</span>,
                            }}
                            onChange={handleChange}
                        />

                        <InputNumber
                            placeholder="10"
                            label="Điểm quy đổi"
                            name="diem"
                            type="number"
                            error={!!errors.diem}
                            helperText={errors.diem}
                            value={values.diem}
                            onChange={handleChange}
                        />

                        <InputNumber
                            placeholder="0"
                            label="Số lượng"
                            name="soluong"
                            type="number"
                            error={!!errors.soluong}
                            helperText={errors.soluong}
                            value={values.soluong}
                            onChange={handleChange}
                        />

                        {actions}
                    </Stack>
                </form>
            )}
        </Formik>
    );
};

export default QuaKhuyenDungForm;
