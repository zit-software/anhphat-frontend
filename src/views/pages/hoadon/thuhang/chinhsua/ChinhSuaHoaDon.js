import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { IconDeviceFloppy, IconFile, IconPencil, IconPlus, IconTrash, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import HoaDonNhapService from 'services/hoadonnhap.service';
import MainCard from 'ui-component/cards/MainCard';
import * as Yup from 'yup';

import productcategoryservice from 'services/productcategory.service';
import RowSkeleton from 'ui-component/skeletons/RowSkeleton';
import dayjs from 'utils/dayjs';
import formatter from 'views/utilities/formatter';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const HangHoaRow = ({ index, value, disabled, onChange, onRemove }) => {
    const { data: products, isLoading } = useQuery(
        ['products'],
        productcategoryservice.getAllCategoriesAndDonvi
    );
    const [edit, setEdit] = useState(true && !disabled);
    const currentUser = useSelector((state) => state.auth.user);

    const product = products?.find((e) => e.ma === value.malh) ||
        (products && products[0]) || { donvi: [] };

    const donvi = product?.donvi?.find((e) => e.ma === value.madv) || {};

    const handleSave = () => {
        setEdit(false);
    };

    if (isLoading) return <RowSkeleton cols={9} />;

    return edit ? (
        <Formik
            enableReinitialize
            initialValues={{
                ma: value.ma || product.ma || '',
                madv: value.madv || product.donvi[0]?.ma,
                malh: value.malh || product.ma,
                soluong: value.soluong || 1,
                hsd: value.hsd || new Date(),
                gianhap: 0,
            }}
            validationSchema={Yup.object().shape({
                malh: Yup.string().required('Vui lòng chọn sản phẩm'),
                madv: Yup.string()
                    .required('Vui lòng chọn đơn vị')
                    .oneOf(
                        product.donvi.map((e) => e.ma.toString()),
                        'Vui lòng chọn đơn vị'
                    ),
                soluong: Yup.number()
                    .required('Vui lòng nhập số lượng')
                    .min(1, 'Số lượng phải từ 1')
                    .integer('Số lượng sản phẩm phải là số nguyên'),
                hsd: Yup.date().required('Vui lòng chọn hạn sử dụng'),
            })}
            validateOnChange
            validate={onChange}
            onSubmit={handleSave}
        >
            {({ values, handleSubmit, errors, handleChange, setFieldValue }) => (
                <TableRow hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <Select
                            error={!!errors.malh}
                            value={values.malh || ''}
                            name="malh"
                            fullWidth
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
                                fullWidth
                                value={values.madv || ''}
                                name="madv"
                                onChange={(event) => {
                                    handleChange({
                                        target: { name: 'madv', value: event.target.value },
                                    });

                                    handleChange({
                                        target: { name: 'gianhap', value: donvi.gianhap },
                                    });
                                }}
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
                            value={dayjs(values.hsd)}
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => (
                                <TextField fullWidth name="hsd" {...params} error={!!errors.hsd} />
                            )}
                            onChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'hsd',
                                        value: value.$d,
                                    },
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
                            value={values.soluong}
                            name="soluong"
                            onChange={handleChange}
                        />
                        <FormHelperText error>{errors.soluong}</FormHelperText>
                    </TableCell>

                    {currentUser.laAdmin && (
                        <>
                            <TableCell>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Đơn giá</InputLabel>
                                    <OutlinedInput
                                        disabled
                                        error={!!errors.gianhap}
                                        placeholder="Đơn giá"
                                        type="number"
                                        label="Đơn giá"
                                        value={values.gianhap}
                                        name="gianhap"
                                        endAdornment={
                                            <InputAdornment position="end">vnđ</InputAdornment>
                                        }
                                    />
                                    <FormHelperText error>{errors.gianhap}</FormHelperText>
                                </FormControl>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2">
                                    {formatter.format(values.gianhap * values.soluong)}
                                </Typography>
                            </TableCell>
                        </>
                    )}

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
            {currentUser.laAdmin && (
                <>
                    <TableCell>{formatter.format(value.gianhap)}</TableCell>
                    <TableCell>{formatter.format((value.soluong || 1) * value.gianhap)}</TableCell>
                </>
            )}
            {!disabled && (
                <>
                    <TableCell>
                        <IconButton color="secondary" onClick={() => setEdit(true)}>
                            <IconPencil />
                        </IconButton>
                    </TableCell>
                    <TableCell></TableCell>
                </>
            )}
        </TableRow>
    );
};

function ChinhSuaHoaDon() {
    const params = useParams();
    const navigate = useNavigate();
    const [chitiet, setChiTiet] = useState(false);

    const currentUser = useSelector((state) => state.auth.user);

    const {
        data: phieunhap,
        isLoading,
        isError,
        refetch,
    } = useQuery([params.ma, chitiet], () =>
        HoaDonNhapService.layPhieuNhap(params.ma, { chitiet })
    );
    const [saveModal, setSaveModal] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [ghichu, setGhichu] = useState('');

    const [rows, setRows] = useState([]);

    const addRow = () =>
        setRows((prev) => [...prev, { ma: Math.random(), gianhap: 0, soluong: 0 }]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const payload = {
                ...saveModal,
                chitiets: rows.map((row) => {
                    const { ma, ..._return } = row;

                    return _return;
                }),
                ghichu,
            };

            await HoaDonNhapService.luu(phieunhap.ma, payload);
            await refetch();
        } catch (error) {
            toast.error(error.response?.data.message || error.message);
        } finally {
            setSaveModal(null);

            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (isLoading || !phieunhap.daluu) return;

        setRows(
            phieunhap.chitiet.map((row) => ({
                ...row,
                malh: row.mathang.malh,
                madv: row.mathang.madv,
                hsd: row.mathang.hsd,
                gianhap: row.mathang.gianhap,
            }))
        );
    }, [phieunhap, isLoading]);

    if (isError) return navigate('/');
    if (isLoading) return <LinearProgress />;

    return (
        <MainCard
            title={
                <Badge>
                    <Typography variant="h2">
                        Hóa đơn thu hàng
                        <span
                            style={{
                                color: '#aaa',
                            }}
                        >
                            #{phieunhap.ma}
                        </span>
                    </Typography>
                </Badge>
            }
        >
            {isSaving && <LinearProgress />}
            <Formik
                initialValues={{
                    ...phieunhap,
                }}
                validationSchema={Yup.object().shape({
                    ngaynhap: Yup.date('Vui lòng nhập đúng định dạng DD/MM/YYYY').required(
                        'Vui lòng chọn ngày nhập'
                    ),
                })}
                onSubmit={setSaveModal}
            >
                {({ values, errors, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} direction="column" sx={{ ml: -2, p: 2 }}>
                            <Typography variant="subtitle2">Thông tin hóa đơn</Typography>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell rowSpan={2}>Mã số</TableCell>
                                        <TableCell rowSpan={2}>Tên hóa đơn</TableCell>
                                        <TableCell rowSpan={2}>Ngày tạo</TableCell>
                                        <TableCell colSpan={2}>Người tạo</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Mã nhân viên</TableCell>
                                        <TableCell>Tên nhân viên</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow>
                                        <TableCell>{values.ma}</TableCell>
                                        <TableCell>Hóa đơn thu hàng</TableCell>
                                        <TableCell>
                                            {dayjs(values.createdAt).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell>{values.nguoinhap.ma}</TableCell>
                                        <TableCell>{values.nguoinhap.ten}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Typography variant="subtitle2">Nhà phân phối</Typography>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã nhà phân phối</TableCell>
                                        <TableCell>Tên nhà phân phối</TableCell>
                                        <TableCell>Ngày thu</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow>
                                        <TableCell>{values.npp.ma}</TableCell>
                                        <TableCell>{values.npp.ten}</TableCell>
                                        <TableCell>
                                            {dayjs(values.ngaynhap).format('DD/MM/YYYY')}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Typography variant="subtitle2">Thông tin chi tiết</Typography>

                            {phieunhap.daluu && (
                                <FormControlLabel
                                    label="Hiện chi tiết mặt hàng"
                                    control={<Switch checked={chitiet} />}
                                    onChange={(event) => {
                                        setChiTiet(event.target.checked);
                                    }}
                                />
                            )}

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Tên hàng hóa</TableCell>
                                            <TableCell>Đơn vị tính</TableCell>
                                            <TableCell>Hạn sử dụng</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            {currentUser.laAdmin && (
                                                <>
                                                    <TableCell>Đơn giá</TableCell>
                                                    <TableCell>Thành tiền</TableCell>
                                                </>
                                            )}

                                            {!phieunhap.daluu && (
                                                <>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>2</TableCell>
                                            <TableCell>3</TableCell>
                                            <TableCell>4</TableCell>
                                            <TableCell>5</TableCell>
                                            {currentUser.laAdmin && (
                                                <>
                                                    <TableCell>6</TableCell>
                                                    <TableCell>7 = 5 x 6</TableCell>
                                                </>
                                            )}
                                            {!phieunhap.daluu && (
                                                <>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <HangHoaRow
                                                index={index}
                                                key={row.ma || row.id || Math.random()}
                                                value={row}
                                                onChange={(values) => {
                                                    setRows((prev) =>
                                                        prev.map((v, i) => {
                                                            if (index === i) v = values;
                                                            return v;
                                                        })
                                                    );
                                                }}
                                                disabled={phieunhap.daluu}
                                                onRemove={() => {
                                                    setRows((prev) =>
                                                        prev.filter((e, i) => i !== index)
                                                    );
                                                }}
                                            />
                                        ))}
                                        {!phieunhap.daluu && (
                                            <TableRow>
                                                <TableCell colSpan={9}>
                                                    <Button
                                                        type="button"
                                                        fullWidth
                                                        onClick={addRow}
                                                    >
                                                        <IconPlus />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>

                                    {currentUser.laAdmin && (
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Typography>Tổng cộng</Typography>
                                                </TableCell>

                                                <TableCell colSpan={3}>
                                                    {formatter.format(
                                                        rows.reduce(
                                                            (prev, curent) =>
                                                                curent.gianhap *
                                                                    (curent.soluong || 1) +
                                                                prev,
                                                            0
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    )}
                                </Table>
                            </TableContainer>

                            <FormControl>
                                <FormLabel>Ghi chú</FormLabel>

                                {phieunhap.daluu ? (
                                    <p>{phieunhap.ghichu}</p>
                                ) : (
                                    <TextField
                                        multiline
                                        rows={4}
                                        defaultValue={phieunhap.ghichu}
                                        onChange={(event) => setGhichu(event.target.value)}
                                    />
                                )}
                            </FormControl>

                            <Stack direction="row" spacing={2}>
                                {!phieunhap.daluu && (
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        startIcon={<IconFile />}
                                        disabled={isSaving}
                                        onClick={handleSubmit}
                                    >
                                        Lưu
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    startIcon={<IconX />}
                                    onClick={() => navigate(-1)}
                                >
                                    Đóng
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                )}
            </Formik>

            <SaveModal
                open={!!saveModal}
                onClose={() => setSaveModal(null)}
                onSubmit={handleSave}
            />
        </MainCard>
    );
}

const SaveModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClick={onClose}>
            <DialogTitle>Lưu hóa đơn</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Lưu ý: Bạn không thể chỉnh sửa hóa đơn sau khi lưu
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onSubmit} variant="contained">
                    Lưu
                </Button>
                <Button onClick={onClose}>Hủy</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChinhSuaHoaDon;
