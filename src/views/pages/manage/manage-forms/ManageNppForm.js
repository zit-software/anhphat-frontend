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

import MilkBox from 'assets/images/milk-box.png';
import MilkBox2 from 'assets/images/milk-box-2.png';

function ManageNppForm({ value = {}, buttonText, onSubmit }) {
    return (
        <Formik
            initialValues={{
                ten: value.ten || '',
                chietkhau: value.chietkhau || 0,
                matinh: value.matinh || '92',
            }}
            validationSchema={Yup.object().shape({
                ten: Yup.string().required('Vui lòng nhập tên nhà phân phối'),
                chietkhau: Yup.number().test(
                    'valid',
                    'Chiếu khấu phải từ 0 - 100%',
                    (v) => v >= 0 && v <= 1
                ),
                matinh: Yup.string().required('Vui lòng chọn tỉnh thành'),
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ padding: '10px 0', width: 300 }}>
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            value={values.ten}
                            error={!!errors.ten}
                            label="Tên nhà phân phối"
                            placeholder="Nguyễn Văn A"
                            name="ten"
                            autoComplete="name"
                            onChange={handleChange}
                        />

                        <FormHelperText error>{errors.ten}</FormHelperText>

                        <Autocomplete
                            options={ProvinceService.getAll().map((province) => ({
                                label: province.name,
                                ma: province.code,
                            }))}
                            isOptionEqualToValue={(opt, v) => {
                                return opt.ma === v;
                            }}
                            getOptionLabel={(v) => ProvinceService.findByCode(v.ma || v)?.name}
                            value={values.matinh}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Tỉnh / Thành phố"
                                        placeholder="Thành phố Cần Thơ"
                                        error={!!errors.matinh}
                                    />
                                );
                            }}
                            onChange={(_, v) => {
                                handleChange({
                                    target: {
                                        name: 'matinh',
                                        value: v.ma,
                                    },
                                });
                            }}
                        />
                        <FormHelperText error>{errors.matinh}</FormHelperText>

                        <FormControl fullWidth>
                            <InputLabel>Chiết khấu</InputLabel>
                            <OutlinedInput
                                value={values.chietkhau * 100 || ''}
                                error={!!errors.chietkhau}
                                label="Chiết khấu"
                                placeholder="16%"
                                name="chietkhau"
                                autoComplete="off"
                                type="number"
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                onChange={(event) => {
                                    handleChange({
                                        target: {
                                            value: Number(event.target.value) / 100,
                                            name: 'chietkhau',
                                        },
                                    });
                                }}
                            />
                            <FormHelperText error>{errors.chietkhau}</FormHelperText>
                        </FormControl>

                        <div style={{ position: 'relative' }} className="milk-box">
                            <img
                                src={MilkBox2}
                                alt="milk-box"
                                width="100%"
                                style={{
                                    transition: '2s ease',
                                    position: 'absolute',
                                    top: 0,
                                    left: '0',
                                }}
                            />

                            <img
                                src={MilkBox}
                                alt="milk-box"
                                width="100%"
                                style={{
                                    clipPath: `polygon(0 ${values.chietkhau * 100}%, 100% ${
                                        values.chietkhau * 100
                                    }%, 100% 100%, 0 100%)`,
                                    transition: '2s ease',
                                }}
                            />
                        </div>

                        <Button variant="contained" color="primary" type="submit">
                            {buttonText || 'Thêm'}
                        </Button>
                    </Stack>
                </form>
            )}
        </Formik>
    );
}

export default ManageNppForm;
