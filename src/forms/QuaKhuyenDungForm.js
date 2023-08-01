import { TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import InputNumber from 'ui-component/input-number';
import * as Yup from 'yup';

const initialValue = {
    ten: '',
    diem: 0,
};

const validationSchema = Yup.object().shape({
    ten: Yup.string().required('Vui lòng nhập tên'),
    diem: Yup.number()
        .required('Vui lòng nhập điểm')
        .min(1, 'Điểm quy đổi phải lớn hơn 0')
        .integer('Điểm quy đổi phải là số nguyên'),
});

const QuaKhuyenDungForm = ({ actions, onSubmit }) => {
    return (
        <Formik
            initialValues={initialValue}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
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

                        {actions}
                    </Stack>
                </form>
            )}
        </Formik>
    );
};

QuaKhuyenDungForm.propTypes = {
    actions: PropTypes.node,
    onSubmit: PropTypes.func,
};

export default QuaKhuyenDungForm;
