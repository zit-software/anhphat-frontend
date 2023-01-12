import {
    Badge,
    Button,
    Divider,
    FormHelperText,
    Grid,
    LinearProgress,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { IconFile, IconPlus } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import HoaDonNhapService from 'services/hoadonnhap.service';
import MainCard from 'ui-component/cards/MainCard';
import * as Yup from 'yup';

import productcategoryservice from 'services/productcategory.service';

const HangHoaRow = ({ index, value, onChange }) => {
    const { data: products, isLoading } = useQuery(
        ['products'],
        productcategoryservice.getAllCategories,
        {
            initialData: []
        }
    );

    if (isLoading) return null;
    return (
        <Formik
            initialValues={{
                madv: null,
                malh: null,
                soluong: 1,
                hsd: null,
                gianhap: 0
            }}
        >
            {({ values, handleSubmit, handleChange }) => (
                <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <Select
                            value={values.malh || products[0]?.ma}
                            name="malh"
                            fullWidth
                            size="small"
                            onChange={handleChange}
                        >
                            {products.map((product) => (
                                <MenuItem key={product.ma} value={product.ma}>
                                    {product.ten}
                                </MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )}
        </Formik>
    );
};

function ChinhSuaHoaDon() {
    const [rows, setRows] = useState([]);

    const currentUser = useSelector((state) => state.auth.user);
    const params = useParams();

    const { data: phieunhap, isLoading } = useQuery([params.ma], HoaDonNhapService.layPhieuNhap);

    const addRow = () => setRows((prev) => [...prev, {}]);

    return (
        <MainCard
            title={
                <Badge>
                    <Typography variant="h2">Hóa đơn nhập</Typography>
                </Badge>
            }
        >
            {isLoading ? (
                <LinearProgress />
            ) : (
                <Formik
                    initialValues={{
                        nguon: phieunhap.nguon,
                        ngaynhap: phieunhap.ngaynhap,
                        nguoigiao: phieunhap.nguoigiao
                    }}
                    validationSchema={Yup.object().shape({
                        nguon: Yup.string().required('Vui lòng nhập nguồn nhập hàng'),
                        ngaynhap: Yup.date().required('Vui lòng chọn ngày nhập'),
                        nguoigiao: Yup.string().required('Vui lòng nhập tên người giao')
                    })}
                >
                    {({ values, errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <Typography variant="subtitle1">Người nhập</Typography>

                                <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                                    <Grid xs={12} md={4} item>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Mã nhân viên"
                                            placeholder="Mã nhân viên"
                                            value={currentUser.ma}
                                            disabled
                                        />
                                    </Grid>

                                    <Grid xs={12} md={4} item>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Tên"
                                            placeholder="Tên"
                                            value={currentUser.ten}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>

                                <Divider />

                                <Typography variant="subtitle1">Nguồn nhập</Typography>

                                <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                                    <Grid xs={12} md={4} item>
                                        <TextField
                                            size="small"
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

                                    <Grid xs={12} md={4} item>
                                        <TextField
                                            size="small"
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
                                    <Grid xs={12} md={4} item>
                                        <DesktopDatePicker
                                            inputFormat="DD/MM/YY"
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    {...params}
                                                    error={!!errors.ngaynhap}
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

                                <Typography variant="subtitle1">Thông tin chi tiết</Typography>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>STT</TableCell>
                                                <TableCell>Tên hàng hóa</TableCell>
                                                <TableCell>Đơn vị tính</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Đơn giá</TableCell>
                                                <TableCell>Thành tiền</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>1</TableCell>
                                                <TableCell>2</TableCell>
                                                <TableCell>3</TableCell>
                                                <TableCell>4</TableCell>
                                                <TableCell>5</TableCell>
                                                <TableCell>6 = 4 x 5</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {rows.map((row, index) => (
                                                <HangHoaRow index={index} key={index} value={row} />
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Button fullWidth onClick={addRow}>
                                                        <IconPlus />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>

                                        <TableFooter></TableFooter>
                                    </Table>
                                </TableContainer>

                                <Divider />

                                <Stack direction="row" spacing={2}>
                                    <Button type="submit">Lưu bản nháp</Button>

                                    <Button
                                        variant="contained"
                                        type="submit"
                                        startIcon={<IconFile />}
                                    >
                                        Lưu
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    )}
                </Formik>
            )}
        </MainCard>
    );
}

export default ChinhSuaHoaDon;
