import {
    Autocomplete,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import ProvinceService from 'services/province.service';
import * as Yup from 'yup';

import MilkBox2 from 'assets/images/milk-box-2.png';
import MilkBox from 'assets/images/milk-box.png';

function ManageNppForm({ value = {}, buttonText, onSubmit, onClose }) {
    return (
        <Formik
            initialValues={{
                ten: value.ten || '',
                chietkhau: value.chietkhau || 0,
                tinh: value.tinh || 92,
                sdt: value.sdt || '',
                truocthue: value.truocthue,
            }}
            validationSchema={Yup.object().shape({
                ten: Yup.string().required('Vui lòng nhập tên nhà phân phối'),
                chietkhau: Yup.number().test(
                    'valid',
                    'Chiếu khấu phải từ 0 - 100%',
                    (v) => v >= 0 && v <= 1
                ),
                tinh: Yup.string().required('Vui lòng chọn tỉnh thành'),
                sdt: Yup.string(),
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ padding: '10px 0' }}>
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

                        <TextField
                            label="Số điện thoại"
                            placeholder="0123456789"
                            name="sdt"
                            value={values.sdt}
                            onChange={handleChange}
                        />

                        <FormHelperText error>{errors.sdt}</FormHelperText>

                        <Autocomplete
                            options={ProvinceService.getAll().map((province) => ({
                                label: province.name,
                                ma: province.code,
                            }))}
                            isOptionEqualToValue={(opt, v) => {
                                return opt.ma === v;
                            }}
                            getOptionLabel={(v) => ProvinceService.findByCode(v.ma || v)?.name}
                            value={values.tinh}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Tỉnh / Thành phố"
                                        placeholder="Thành phố Cần Thơ"
                                        error={!!errors.tinh}
                                    />
                                );
                            }}
                            onChange={(_, v) => {
                                handleChange({
                                    target: {
                                        name: 'tinh',
                                        value: v.ma,
                                    },
                                });
                            }}
                        />
                        <FormHelperText error>{errors.tinh}</FormHelperText>

                        <FormControl fullWidth>
                            <InputLabel>Chiết khấu</InputLabel>
                            <OutlinedInput
                                value={Math.imul(values.chietkhau * 100, 1) || ''}
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

                        <FormControl>
                            <FormLabel>Cách tinh thuế</FormLabel>
                            <RadioGroup
                                name="truocthue"
                                value={Boolean(values.truocthue)}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label="Trước thuế"
                                />
                                <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="Sau thuế"
                                />
                            </RadioGroup>
                        </FormControl>

                        <div style={{ position: 'relative' }} className="milk-box">
                            <img src={MilkBox2} alt="milk-box" width="100%" />

                            <img
                                src={MilkBox}
                                alt="milk-box"
                                width="100%"
                                style={{
                                    clipPath: `polygon(0 ${values.chietkhau * 100}%, 100% ${
                                        values.chietkhau * 100
                                    }%, 100% 100%, 0 100%)`,
                                }}
                            />
                        </div>

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

export default ManageNppForm;
