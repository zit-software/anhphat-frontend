import { AutoFixHigh, Close, DeleteOutline, Edit, Save, SwipeVertical } from '@mui/icons-material';
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
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import HoaDonXuatService from 'services/hoadonxuat.service';
import productcategoryservice from 'services/productcategory.service';
import ProvinceService from 'services/province.service';
import MainCard from 'ui-component/cards/MainCard';
import RowSkeleton from 'ui-component/skeletons/RowSkeleton';
import formatter from 'views/utilities/formatter';
import * as Yup from 'yup';

const AutoHangHoaRow = ({ index, value, disabled, onChange, onRemove }) => {
    const { data: products, isLoading } = useQuery(
        ['products'],
        productcategoryservice.getAllCategoriesAndDonvi
    );
    const [edit, setEdit] = useState(true && !disabled);
    const [conlai, setConlai] = useState(0);
    const refFormik = useRef(null);

    const product = products?.find((e) => e.ma === value.malh) ||
        (products && products[0]) || { donvi: [] };

    const donvi = product?.donvi?.find((e) => e.ma === value.madv) || {};

    const handleSave = () => {
        if (refFormik.current?.isValid) setEdit(false);
    };

    useEffect(() => {
        if (!product.donvi[0]) return;

        productcategoryservice.getSoluongMathang(value.madv || product.donvi[0]?.ma).then((res) => {
            setConlai(res.data.soluong);
        });
    }, [product.donvi, value.madv]);

    useEffect(() => {
        refFormik.current?.validateForm();
    }, [conlai]);

    if (isLoading) return <RowSkeleton cols={9} />;

    return edit ? (
        <Formik
            innerRef={refFormik}
            initialValues={{
                ma: value.ma || product.ma || '',
                madv: value.madv || product.donvi[0]?.ma,
                malh: value.malh || product.ma,
                soluong: value.soluong || 1,
                giaban: value.giaban || product.donvi[0].giaban || 0,
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
                    .max(conlai, () => `Số lượng mặt hàng còn lại là ${conlai}`)
                    .integer('Số lượng sản phẩm phải là số nguyên'),
                giaban: Yup.number().required('Vui lòng nhập giá xuất').min(0, 'Giá phải từ 0'),
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
                    <TableCell></TableCell>
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
                        <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>Đơn giá</InputLabel>
                            <OutlinedInput
                                error={!!errors.giaban}
                                placeholder="Đơn giá"
                                type="number"
                                label="Đơn giá"
                                value={values.giaban}
                                name="giaban"
                                endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                                onChange={handleChange}
                            />
                            <FormHelperText error>{errors.giaban}</FormHelperText>
                        </FormControl>

                        {product.donvi.find((e) => e.ma === value.madv)?.giaban &&
                            product.donvi.find((e) => e.ma === value.madv)?.giaban !==
                                value.giaban && (
                                <Button
                                    size="small"
                                    fullWidth
                                    onClick={() =>
                                        setFieldValue(
                                            'giaban',
                                            product.donvi.find((e) => e.ma === value.madv).giaban
                                        )
                                    }
                                >
                                    {product.donvi.find((e) => e.ma === value.madv)?.giaban}
                                </Button>
                            )}
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle2">
                            {formatter.format(values.giaban * values.soluong)}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Stack direction="row">
                            <IconButton
                                disabled={!refFormik.current?.isValid}
                                size="small"
                                onClick={handleSubmit}
                            >
                                <Save />
                            </IconButton>
                            <IconButton size="small" onClick={onRemove}>
                                <DeleteOutline />
                            </IconButton>
                        </Stack>
                    </TableCell>
                </TableRow>
            )}
        </Formik>
    ) : (
        <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{product.ten}</TableCell>
            <TableCell>{donvi.ten}</TableCell>
            <TableCell></TableCell>
            <TableCell>{value.soluong}</TableCell>
            <TableCell>{formatter.format(value.giaban)}</TableCell>
            <TableCell>{formatter.format((value.soluong || 1) * value.giaban)}</TableCell>
            {!disabled && (
                <TableCell>
                    <IconButton onClick={() => setEdit(true)}>
                        <Edit />
                    </IconButton>
                </TableCell>
            )}
        </TableRow>
    );
};

const ManualAddModal = ({ open, selecteds = [], onUpdate, onClose }) => {
    const { data: mathang } = useQuery(['mathang'], productcategoryservice.getAllMatHang);

    const fixedMathang = mathang || {
        data: [],
        total: 0,
    };

    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>Thêm mặt hàng</DialogTitle>
            <DialogContent>
                <DataGrid
                    sx={{ height: 600 }}
                    autoPageSize
                    density="compact"
                    rows={fixedMathang.data.map((e) => ({
                        ...e,
                        id: e.ma,
                    }))}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã',
                        },
                        {
                            field: 'loaihang',
                            headerName: 'Tên mặt hàng',
                            renderCell({ value }) {
                                return value.ten;
                            },
                            flex: 1,
                        },
                        {
                            field: 'donvi',
                            headerName: 'Đơn vị',
                            renderCell({ value }) {
                                return value.ten;
                            },
                            flex: 1,
                        },
                        {
                            field: 'hsd',
                            headerName: 'Hạn sử dụng',
                            flex: 1,
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                        },
                        {
                            field: 'gianhap',
                            headerName: 'Giá nhập',
                            flex: 1,
                            renderCell({ value }) {
                                return formatter.format(value);
                            },
                        },
                        {
                            field: 'giaban',
                            headerName: 'Giá bán',
                            flex: 1,
                            renderCell({ value }) {
                                return formatter.format(value);
                            },
                        },
                    ]}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    checkboxSelection
                    selectionModel={selecteds}
                    onSelectionModelChange={onUpdate}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ManualRow = ({ mathang, index, dongia, updateDongia }) => {
    useEffect(() => {
        updateDongia(mathang.giaban);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mathang.giaban]);

    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{mathang.loaihang.ten}</TableCell>
            <TableCell>{mathang.donvi.ten}</TableCell>
            <TableCell>{dayjs(mathang.hsd).format('DD/MM/YYYY')}</TableCell>
            <TableCell>1</TableCell>
            <TableCell>
                <TextField
                    size="small"
                    label="Đơn giá"
                    placeholder="1.000.000đ"
                    value={dongia || '0'}
                    required
                    type="number"
                    onChange={(event) => {
                        updateDongia(event.target.value);
                    }}
                />

                {parseInt(dongia) !== mathang.giaban && (
                    <Button size="small" onClick={() => updateDongia(mathang.giaban)}>
                        {formatter.format(mathang.giaban)}
                    </Button>
                )}
            </TableCell>
            <TableCell>{formatter.format(dongia)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

const SavedRow = ({ value, index }) => {
    return (
        <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{value.mathang.loaihang.ten}</TableCell>
            <TableCell>{value.mathang.donvi.ten}</TableCell>
            <TableCell>{dayjs(value.mathang.hsd).format('DD/MM/YYYY')}</TableCell>
            <TableCell>{value.soluong || 1}</TableCell>
            <TableCell>{formatter.format(value.mathang.giaban)}</TableCell>
            <TableCell>{formatter.format(value.thanhtien || value.mathang.giaban)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

function ChinhSuaHoaDon() {
    const navigate = useNavigate();
    const params = useParams();
    const [chitiet, setChitiet] = useState(false);

    const {
        data: phieuxuat,
        isLoading,
        refetch,
    } = useQuery([params.ma, chitiet], () =>
        HoaDonXuatService.layMotHoaDon(params.ma, { chitiet }).then((res) => res.data)
    );

    const { data: mathang } = useQuery(['tatcamathang'], productcategoryservice.getAllMatHang);

    const [autoRows, setAutoRows] = useState([]);

    const addAutoRow = () => {
        setAutoRows((prev) => [
            ...prev,
            {
                ma: Math.random(),
            },
        ]);
    };

    const updateAutoRow = (index, value) => {
        setAutoRows((prev) =>
            prev.map((e, i) => {
                if (i === index) return value;

                return e;
            })
        );
    };

    const removeAutoRow = (index) => {
        setAutoRows((prev) => prev.filter((_, i) => i !== index));
    };

    const [openManualModal, setOpenManualModal] = useState(false);
    const [selectedManual, setSelectedManual] = useState([]);
    const [manualDongia, setManualDongia] = useState({});

    const handleOpenManualModal = () => setOpenManualModal(true);
    const handleCloseManualModal = () => setOpenManualModal(false);

    const [showSaveModal, setShowSaveModal] = useState(false);

    const handleOpenSaveModal = () => setShowSaveModal(true);
    const handleCloseSaveModal = () => setShowSaveModal(false);

    const handleSave = async () => {
        try {
            await HoaDonXuatService.luuPhieuXuat(params.ma, {
                auto: autoRows,
                manual: selectedManual.map((e) => ({
                    mh: e,
                    giaban: manualDongia[e],
                })),
            });
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            handleCloseSaveModal();
            refetch();
        }
    };

    const fixedMathang = mathang || { total: 0, data: [] };

    if (isLoading) return <LinearProgress />;

    return (
        <MainCard
            title={
                <Badge>
                    <Typography variant="h2">
                        Hóa đơn xuất{' '}
                        <span
                            style={{
                                color: '#aaa',
                            }}
                        >
                            #{params.ma}
                        </span>
                    </Typography>
                </Badge>
            }
        >
            <Stack spacing={2}>
                <Typography variant="subtitle2">Thông tin hóa đơn</Typography>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2}>Mã số hóa đơn</TableCell>
                            <TableCell rowSpan={2}>Tên hóa đơn</TableCell>
                            <TableCell rowSpan={2}>Ngày tạo</TableCell>
                            <TableCell colSpan={2} align="center">
                                Người tạo
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Mã nhân viên</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell>{phieuxuat.ma}</TableCell>
                            <TableCell>Hóa đơn xuất hàng</TableCell>
                            <TableCell>{dayjs(phieuxuat.createdAt).format('DD/MM/YYYY')}</TableCell>
                            <TableCell>{phieuxuat.nguoinhap.ma}</TableCell>
                            <TableCell>{phieuxuat.nguoinhap.ten}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="subtitle2">Thông tin nhà phân phối</Typography>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã nhà phân phối</TableCell>
                            <TableCell>Tên nhà phân phối</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Tỉnh thành</TableCell>
                            <TableCell>Chiết khấu</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell>{phieuxuat.npp.ma}</TableCell>
                            <TableCell>{phieuxuat.npp.ten}</TableCell>
                            <TableCell>{phieuxuat.npp.sdt}</TableCell>
                            <TableCell>
                                {ProvinceService.findByCode(phieuxuat.npp.tinh)?.name}
                            </TableCell>
                            <TableCell>{phieuxuat.npp.chietkhau * 100}%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="subtitle2">Thông tin chi tiết</Typography>

                {phieuxuat.daluu && (
                    <FormControlLabel
                        label="Chi tiết mặt hàng"
                        checked={chitiet}
                        onChange={(event) => setChitiet(event.target.checked)}
                        control={<Switch />}
                    />
                )}

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
                        </TableRow>
                    </TableHead>

                    {!phieuxuat.daluu ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={10}>Các mặt hàng thêm tự động</TableCell>
                            </TableRow>

                            {autoRows.map((row, index) => (
                                <AutoHangHoaRow
                                    index={index}
                                    key={row.ma}
                                    value={row}
                                    onChange={(value) => updateAutoRow(index, value)}
                                    onRemove={() => removeAutoRow(index)}
                                />
                            ))}

                            <TableRow>
                                <TableCell colSpan={10}>
                                    <Button
                                        fullWidth
                                        startIcon={<AutoFixHigh />}
                                        size="small"
                                        onClick={addAutoRow}
                                    >
                                        Thêm tự động
                                    </Button>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={10}>Các mặt hàng thêm thủ công</TableCell>
                            </TableRow>

                            {fixedMathang.data
                                .filter((e) => selectedManual.includes(e.ma))
                                .map((mathang, index) => (
                                    <ManualRow
                                        key={mathang.ma}
                                        index={index}
                                        mathang={mathang}
                                        updateDongia={(dongia) => {
                                            setManualDongia((prev) => {
                                                return { ...prev, [mathang.ma]: dongia };
                                            });
                                        }}
                                        dongia={manualDongia[mathang.ma]}
                                    />
                                ))}

                            <TableRow>
                                <TableCell colSpan={10}>
                                    <Button
                                        fullWidth
                                        startIcon={<SwipeVertical />}
                                        size="small"
                                        onClick={handleOpenManualModal}
                                    >
                                        Thêm thủ công
                                    </Button>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={6}>Tổng</TableCell>
                                <TableCell colSpan={2}>
                                    {formatter.format(
                                        autoRows.reduce(
                                            (prev, current) =>
                                                prev + current.giaban * current.soluong,
                                            0
                                        ) +
                                            Object.keys(manualDongia).reduce(
                                                (prev, current) => prev + manualDongia[current],
                                                0
                                            )
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {phieuxuat.chitiet.map((value, index) => (
                                <SavedRow index={index} key={index} value={value} />
                            ))}

                            <TableRow>
                                <TableCell colSpan={6}>Tổng</TableCell>
                                <TableCell colSpan={2}>
                                    {formatter.format(phieuxuat.tongtien)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        disabled={!!phieuxuat.daluu}
                        startIcon={<Save />}
                        onClick={handleOpenSaveModal}
                    >
                        Lưu
                    </Button>
                    <Button startIcon={<Close />} onClick={() => navigate(-1)}>
                        Đóng
                    </Button>
                </Stack>
            </Stack>

            <ManualAddModal
                open={openManualModal}
                selecteds={selectedManual}
                onClose={handleCloseManualModal}
                onUpdate={setSelectedManual}
            />

            <SaveModal open={showSaveModal} onClose={handleCloseSaveModal} onSubmit={handleSave} />
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
