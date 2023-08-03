import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Formik } from 'formik';
import { useState } from 'react';
import { useEffect } from 'react';
import AuthService from 'services/auth.service';
import * as Yup from 'yup';

const { default: MainCard } = require('ui-component/cards/MainCard');
const CreatePhieuXuatQuaKhuyenDung = () => {
    const handleSubmit = () => {};
    const [currentUser, setCurrentUser] = useState({ ma: '', ten: '' });

    useEffect(() => {
        const getCurrentUser = async () => {
            const currentUser = (await AuthService.auth()).data;
            console.log(currentUser);
            setCurrentUser(currentUser);
        };
        getCurrentUser();
    }, []);
    return (
        <MainCard title="Lập Phiếu Xuất Quà Khuyến Dùng">
            <Stack spacing={2} direction="column" sx={{ ml: -2, p: 2 }}>
                <Formik
                    initialValues={{
                        ngayxuat: new Date(),
                        manpp: '',
                        currentUser,
                    }}
                    onSubmit={handleSubmit}
                    validateOnChange
                    validationSchema={Yup.object().shape({
                        ngayxuat: Yup.date().required('Ngày Xuất Không Được Trống'),
                        manpp: Yup.string().required('Nhà Phân Phối Không Được Trống'),
                    })}
                    enableReinitialize
                >
                    {({ values, errors, handleChange, handleSubmit }) => (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell rowSpan={2}>Tên hóa đơn</TableCell>
                                    <TableCell rowSpan={2}>Ngày tạo</TableCell>
                                    <TableCell rowSpan={2}>Nhà Phân Phối</TableCell>
                                    <TableCell colSpan={2}>Người tạo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Mã nhân viên</TableCell>
                                    <TableCell>Tên nhân viên</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell rowSpan={2}>Hóa Đơn Tặng Quà Khuyến Dùng</TableCell>
                                    <TableCell>
                                        <DatePicker
                                            onChange={(value) => {
                                                handleChange({
                                                    target: {
                                                        name: 'ngayxuat',
                                                        values: value.$d,
                                                    },
                                                });
                                            }}
                                            name="ngayxuat"
                                            label="Ngày Xuất"
                                            inputFormat="DD/MM/YYYY"
                                            renderInput={(props) => (
                                                <TextField
                                                    fullWidth
                                                    {...props}
                                                    error={errors.ngayxuat}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell rowSpan={2}></TableCell>
                                    <TableCell>{values.currentUser.ma}</TableCell>
                                    <TableCell>{values.currentUser.ten}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </Formik>
            </Stack>
        </MainCard>
    );
};

export default CreatePhieuXuatQuaKhuyenDung;
