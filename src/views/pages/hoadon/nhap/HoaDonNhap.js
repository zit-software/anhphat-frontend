import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormHelperText,
    Grid,
    IconButton,
    TextField,
    Tooltip
} from '@mui/material';
import { IconFilePlus } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router';
import HoaDonNhapService from 'services/hoadonnhap.service';
import MainCard from 'ui-component/cards/MainCard';
import { useSelector } from 'react-redux';

const TaoHoaDonModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.auth.user);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tạo hóa đơn nhập</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        nguon: 'Công ty',
                        nguoigiao: '',
                        ngaynhap: new Date()
                    }}
                    validationSchema={Yup.object().shape({
                        nguon: Yup.string().required('Vui lòng nhập nguồn nhập hàng'),
                        ngaynhap: Yup.date().required('Vui lòng chọn ngày nhập'),
                        nguoigiao: Yup.string().required('Vui lòng nhập tên người giao')
                    })}
                    onSubmit={async (values) => {
                        try {
                            const data = await (
                                await HoaDonNhapService.taoHoaDon({
                                    ...values,
                                    mauser: currentUser.ma
                                })
                            ).data;
                            navigate(`/hoadon/nhap/${data.ma}`);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    {({ values, errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                                <Grid xs={12} item>
                                    <TextField
                                        fullWidth
                                        label="Nguồn"
                                        placeholder="Nguồn"
                                        name="nguon"
                                        value={values.nguon}
                                        error={!!errors.nguon}
                                        onChange={handleChange}
                                    />

                                    <FormHelperText error>{errors.nguon}</FormHelperText>
                                </Grid>

                                <Grid xs={12} item>
                                    <TextField
                                        fullWidth
                                        label="Người giao"
                                        placeholder="Người giao"
                                        name="nguoigiao"
                                        value={values.nguoigiao}
                                        error={!!errors.nguoigiao}
                                        onChange={handleChange}
                                    />

                                    <FormHelperText error>{errors.nguoigiao}</FormHelperText>
                                </Grid>
                                <Grid xs={12} item>
                                    <DatePicker
                                        inputFormat="DD/MM/YY"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.ngaynhap}
                                                fullWidth
                                            />
                                        )}
                                        value={values.ngaynhap}
                                        name="ngaynhap"
                                        label="Ngày nhập"
                                        onChange={(value) => {
                                            handleChange({
                                                target: {
                                                    name: 'ngaynhap',
                                                    value: value?.$d
                                                }
                                            });
                                        }}
                                    />
                                    <FormHelperText error>{errors.ngaynhap}</FormHelperText>
                                </Grid>
                            </Grid>

                            <Divider />

                            <Button type="submit">Tạo</Button>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

const HoaDonNhap = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    return (
        <MainCard title="Hóa đơn nhập">
            <div>
                <Tooltip>
                    <IconButton onClick={handleOpen}>
                        <IconFilePlus />
                    </IconButton>
                </Tooltip>
            </div>

            <TaoHoaDonModal open={open} onClose={handleClose} />
        </MainCard>
    );
};

export default HoaDonNhap;
