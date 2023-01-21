import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { IconEqual, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import * as Yup from 'yup';

function QuyCachForm({ value = {}, onClose, onSubmit }) {
    const [selectedloaihang, setselectedloaihang] = useState(value.malh || '');

    const { data: categories, isLoading: loadingCategories } = useQuery(
        'allProductsCategoryAddQuyCach',
        productcategoryservice.getAllCategories
    );

    const { data: donvis, isLoading: loadingDonvi } = useQuery(
        [selectedloaihang],
        productcategoryservice.getAllDonVisByLoaiHang
    );

    const fixedDonvi = donvis || [];
    const fixedCategories = categories || [];

    return (
        <Formik
            initialValues={{
                malh: value.malh || '',
                madv1: value.madv1 || '',
                madv2: value.madv2 || '',
                soluong: value.soluong || 0,
            }}
            validationSchema={Yup.object().shape({
                malh: Yup.number().required('Vui lòng chọn loại hàng'),
                madv1: Yup.number().required('Vui lòng chọn đơn vị lớn'),
                madv2: Yup.number().required('Vui lòng chọn đơn vị nhỏ'),
                soluong: Yup.number()
                    .required('Vui lòng nhập số lượng')
                    .integer('Số lượng phải là số nguyên')
                    .min(1, 'Số lượng phải > 0'),
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    {(loadingCategories || loadingDonvi) && <LinearProgress />}
                    <DialogTitle>Thêm quy cách</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 1 }} error={!!errors.malh}>
                            <InputLabel>Loại hàng</InputLabel>
                            <Select
                                name="malh"
                                value={values.malh}
                                label="Loại hàng"
                                placeholder="Loại hàng"
                                onChange={(event) => {
                                    handleChange(event);
                                    setFieldValue('madv1', '');
                                    setFieldValue('madv2', '');
                                    setselectedloaihang(event.target.value);
                                }}
                            >
                                {fixedCategories.map((e) => (
                                    <MenuItem key={e.ma} value={e.ma}>
                                        {e.ten}
                                    </MenuItem>
                                ))}
                            </Select>

                            <FormHelperText error>{errors.malh}</FormHelperText>
                        </FormControl>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={3}>
                                <FormControl fullWidth error={!!errors.madv1}>
                                    <InputLabel>Đơn vị lớn</InputLabel>
                                    <Select
                                        name="madv1"
                                        value={values.madv1}
                                        label="Đơn vị lớn"
                                        placeholder="Đơn vị lớn"
                                        onChange={handleChange}
                                    >
                                        {fixedDonvi
                                            .filter(() => values.malh)
                                            .map((e) => (
                                                <MenuItem key={e.ma} value={e.ma}>
                                                    {e.ten}
                                                </MenuItem>
                                            ))}
                                    </Select>

                                    <FormHelperText error>{errors.madv1}</FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid item xs={1}>
                                <IconButton disabled>
                                    <IconEqual />
                                </IconButton>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth error={!!errors.madv2}>
                                    <InputLabel>Đơn vị nhỏ</InputLabel>
                                    <Select
                                        name="madv2"
                                        value={values.madv2}
                                        label="Đơn vị nhỏ"
                                        placeholder="Đơn vị nhỏ"
                                        onChange={handleChange}
                                    >
                                        {fixedDonvi
                                            .filter((e) => e.ma !== values.madv1 && values.malh)
                                            .map((e) => (
                                                <MenuItem key={e.ma} value={e.ma}>
                                                    {e.ten}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    <FormHelperText error>{errors.madv2}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton disabled>
                                    <IconX />
                                </IconButton>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    error={!!errors.soluong}
                                    fullWidth
                                    label="Số lượng quy đổi"
                                    type="number"
                                    placeholder="12"
                                    name="soluong"
                                    value={values.soluong}
                                    onChange={handleChange}
                                />

                                <FormHelperText error>{errors.soluong}</FormHelperText>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained">
                            Lưu
                        </Button>
                        <Button type="button" onClick={onClose}>
                            Hủy
                        </Button>
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
}

export default QuyCachForm;
