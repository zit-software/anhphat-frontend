import {
    Badge,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    OutlinedInput,
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
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { IconDeviceFloppy, IconFile, IconPencil, IconPlus, IconTrash } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import HoaDonNhapService from 'services/hoadonnhap.service';
import MainCard from 'ui-component/cards/MainCard';
import * as Yup from 'yup';

import productcategoryservice from 'services/productcategory.service';
import dayjs from 'utils/dayjs';
import formatter from 'views/utilities/formatter';

const HangHoaRow = ({ index, value, onChange, onRemove, onSave }) => {
    const { data: products, isLoading } = useQuery(
        ['products'],
        productcategoryservice.getAllCategoriesAndDonvi,
        {
            initialData: []
        }
    );
    const [edit, setEdit] = useState(true);

    const product = products.find((e) => e.ma === value.malh);
    const donvi = product?.donvi?.find((e) => e.ma === value.madv);

    const handleSave = () => {
        setEdit(false);
        onSave();
    };

    if (isLoading) return null;
    return edit ? (
        <Formik
            initialValues={{
                madv: value.madv || '',
                malh: value.malh || '',
                soluong: value.soluong || 1,
                hsd: value.hsd || '',
                gianhap: value.gianhap || 0
            }}
            validationSchema={Yup.object().shape({
                malh: Yup.string().required('Vui lòng chọn sản phẩm'),
                madv: Yup.string().required('Vui lòng chọn đơn vị'),
                soluong: Yup.number()
                    .required('Vui lòng nhập số lượng')
                    .min(1, 'Số lượng phải từ 1'),
                hsd: Yup.date().required('Vui lòng chọn hạn sử dụng'),
                gianhap: Yup.number().required('Vui lòng nhập giá nhập').min(0, 'Giá phải từ 0')
            })}
            validateOnChange
            validate={onChange}
            onSubmit={handleSave}
        >
            {({ values, handleSubmit, errors, handleChange }) => (
                <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <Select
                            error={!!errors.malh}
                            value={values.malh || ''}
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
                        <FormHelperText error>{errors.malh}</FormHelperText>
                    </TableCell>
                    <TableCell>
                        {product && (
                            <Select
                                error={!!errors.madv}
                                size="small"
                                fullWidth
                                value={values.madv || ''}
                                name="madv"
                                onChange={handleChange}
                            >
                                {product.donvi.map((donvi) => (
                                    <MenuItem key={donvi.ma} value={donvi.ma}>
                                        {donvi.ten}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                        <FormHelperText error>{errors.madv}</FormHelperText>
                    </TableCell>
                    <TableCell>
                        <DatePicker
                            value={values.hsd}
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => (
                                <TextField name="hsd" size="small" {...params} error={errors.hsd} />
                            )}
                            onChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'hsd',
                                        value: value.$d
                                    }
                                })
                            }
                        />
                        <FormHelperText error>{errors.hsd}</FormHelperText>
                    </TableCell>
                    <TableCell>
                        <TextField
                            error={!!errors.soluong}
                            placeholder="Số lượng"
                            type="number"
                            label="Số lượng"
                            fullWidth
                            size="small"
                            value={values.soluong}
                            name="soluong"
                            onChange={handleChange}
                        />
                        <FormHelperText error>{errors.soluong}</FormHelperText>
                    </TableCell>

                    <TableCell>
                        <FormControl variant="outlined" size="small">
                            <InputLabel>Đơn giá</InputLabel>
                            <OutlinedInput
                                error={!!errors.gianhap}
                                placeholder="Đơn giá"
                                type="number"
                                label="Đơn giá"
                                value={values.gianhap}
                                name="gianhap"
                                endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                                onChange={handleChange}
                            />
                            <FormHelperText error>{errors.gianhap}</FormHelperText>
                        </FormControl>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle2">
                            {formatter.format(values.gianhap * values.soluong)}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <IconButton color="primary" onClick={handleSubmit}>
                            <IconDeviceFloppy />
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        <IconButton color="error" onClick={onRemove}>
                            <IconTrash />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )}
        </Formik>
    ) : (
        <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{product.ten}</TableCell>
            <TableCell>{donvi.ten}</TableCell>
            <TableCell>{dayjs(value.hsd).format('DD/MM/YYYY')}</TableCell>
            <TableCell>{value.soluong}</TableCell>
            <TableCell>{formatter.format(value.gianhap)}</TableCell>
            <TableCell>{formatter.format(value.soluong * value.gianhap)}</TableCell>
            <TableCell>
                <IconButton color="secondary" onClick={() => setEdit(true)}>
                    <IconPencil />
                </IconButton>
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

function ChinhSuaHoaDon() {
    const [rows, setRows] = useState([]);

    const currentUser = useSelector((state) => state.auth.user);
    const params = useParams();

    const { data: phieunhap, isLoading } = useQuery([params.ma], HoaDonNhapService.layPhieuNhap);

    const addRow = () => setRows((prev) => [...prev, { ma: prev.length, gianhap: 0, soluong: 0 }]);

    return (
        <MainCard
            title={
                <Badge>
                    <Typography variant="h2">Hóa đơn nhập #{phieunhap.ma}</Typography>
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
                                                <TableCell>Hạn sử dụng</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Đơn giá</TableCell>
                                                <TableCell>Thành tiền</TableCell>

                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow selected>
                                                <TableCell>1</TableCell>
                                                <TableCell>2</TableCell>
                                                <TableCell>3</TableCell>
                                                <TableCell>4</TableCell>
                                                <TableCell>5</TableCell>
                                                <TableCell>6</TableCell>
                                                <TableCell>7 = 5 x 6</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {rows.map((row, index) => (
                                                <HangHoaRow
                                                    index={index}
                                                    key={row.ma}
                                                    value={row}
                                                    onChange={(values) => {
                                                        setRows((prev) =>
                                                            prev.map((v, i) => {
                                                                if (index === i) v = values;
                                                                return v;
                                                            })
                                                        );
                                                    }}
                                                    onRemove={() => {
                                                        setRows((prev) =>
                                                            prev.filter((e, i) => i !== index)
                                                        );
                                                    }}
                                                    onSave={() => {}}
                                                />
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={9}>
                                                    <Button fullWidth onClick={addRow}>
                                                        <IconPlus />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>

                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Typography>Tổng cộng</Typography>
                                                </TableCell>

                                                <TableCell colSpan={3}>
                                                    {formatter.format(
                                                        rows.reduce(
                                                            (prev, curent) =>
                                                                curent.gianhap * curent.soluong +
                                                                prev,
                                                            0
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
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
