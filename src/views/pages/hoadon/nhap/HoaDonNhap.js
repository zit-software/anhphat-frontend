import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormHelperText,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from '@mui/material';
import { IconFilePlus, IconPencil, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import HoaDonNhapService from 'services/hoadonnhap.service';
import MainCard from 'ui-component/cards/MainCard';
import RowSkeletion from 'ui-component/skeletons/RowSkeleton';

import { Link } from 'react-router-dom';
import dayjs from 'utils/dayjs';

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowPerPage] = useState(10);

    const { data: phieunhap, isLoading } = useQuery(
        ['phieunhap', page, rowsPerPage],
        () => HoaDonNhapService.getAll({ page, limit: rowsPerPage }),
        {
            initialData: { data: [], total: 0 }
        }
    );

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

            <TableContainer sx={{ maxHeight: '70vh' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã số</TableCell>
                            <TableCell>Người tạo</TableCell>
                            <TableCell>Nguồn</TableCell>
                            <TableCell>Người giao</TableCell>
                            <TableCell>Ngày nhập</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Chỉnh sửa lần cuối</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <RowSkeletion cols={9} />
                                <RowSkeletion cols={9} />
                                <RowSkeletion cols={9} />
                                <RowSkeletion cols={9} />
                                <RowSkeletion cols={9} />
                            </>
                        ) : (
                            phieunhap.data.map((phieu) => (
                                <TableRow key={phieu.ma}>
                                    <TableCell>{phieu.ma}</TableCell>
                                    <TableCell>{phieu.nguoinhap.ten}</TableCell>
                                    <TableCell>{phieu.nguon}</TableCell>
                                    <TableCell>{phieu.nguoigiao}</TableCell>
                                    <TableCell>
                                        {dayjs(phieu.ngaynhap).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(phieu.createdAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(phieu.updatedAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        <Link to={{ pathname: '/hoadon/nhap/' + phieu.ma }}>
                                            <IconButton>
                                                <IconPencil />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="error">
                                            <IconX />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPage={rowsPerPage}
                count={phieunhap.total}
                page={page}
                labelRowsPerPage="Dòng trên trang"
                onPageChange={(_, value) => setPage(value)}
                onRowsPerPageChange={({ target: { value } }) => {
                    setRowPerPage(value);
                    setPage(0);
                }}
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
                }
            />

            <TaoHoaDonModal open={open} onClose={handleClose} />
        </MainCard>
    );
};

export default HoaDonNhap;
