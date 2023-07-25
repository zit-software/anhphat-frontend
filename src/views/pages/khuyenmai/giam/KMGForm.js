import {
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import * as Yup from 'yup';

function KMGForm({ value = {}, buttonText, onSubmit, onClose }) {
    return (
        <Formik
            initialValues={{
                ten: value.ten || '',
                tile: value.tile || 0,
            }}
            validationSchema={Yup.object().shape({
                ten: Yup.string().required('Vui lòng nhập tên khuyến mãi giảm'),
                tile: Yup.number()
                    .required('Vui lòng nhập tỉ lệ khuyến mãi')
                    .test('valid', 'Tỉ Lệ giảm phải từ 0 - 100%', (v) => v >= 0 && v <= 1),
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => {
                return (
                    <form onSubmit={handleSubmit} style={{ padding: '10px 0' }}>
                        <Stack spacing={1}>
                            <TextField
                                fullWidth
                                value={values.ten}
                                error={!!errors.ten}
                                label="Tên khuyến mãi giảm"
                                placeholder="Khuyến mãi 30% SPECAL CANXI 400g"
                                name="ten"
                                autoComplete="name"
                                onChange={handleChange}
                            />
                            <FormHelperText error>{errors.ten}</FormHelperText>

                            <FormControl fullWidth>
                                <InputLabel>Tỉ Lệ Giảm</InputLabel>
                                <OutlinedInput
                                    value={values.tile * 100 || ''}
                                    error={!!errors.tile}
                                    label="Chiết khấu"
                                    placeholder="16%"
                                    name="tile"
                                    autoComplete="off"
                                    type="number"
                                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                    onChange={(event) => {
                                        handleChange({
                                            target: {
                                                value: Number(event.target.value) / 100,
                                                name: 'tile',
                                            },
                                        });
                                    }}
                                />
                                <FormHelperText error>{errors.tile}</FormHelperText>
                            </FormControl>

                            <Button variant="contained" color="primary" type="submit">
                                {buttonText || 'Thêm'}
                            </Button>

                            <Button color="primary" type="button" onClick={onClose}>
                                Hủy
                            </Button>
                        </Stack>
                    </form>
                );
            }}
        </Formik>
    );
}

export default KMGForm;
