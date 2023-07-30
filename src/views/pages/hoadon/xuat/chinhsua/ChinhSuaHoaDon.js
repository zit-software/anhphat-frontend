import {
    AutoFixHigh,
    Close,
    DeleteOutline,
    Edit,
    GifBox,
    LocalOffer,
    PanToolAlt,
    Save,
    SwipeVertical,
} from '@mui/icons-material';
import {
    Alert,
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
    Grid,
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
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconX } from '@tabler/icons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import HoaDonXuatService from 'services/hoadonxuat.service';
import khuyenmaigiamService from 'services/khuyenmaigiam.service';
import khuyenmaitangService from 'services/khuyenmaitang.service';
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
                            value={values.soluong}
                            name="soluong"
                            onChange={handleChange}
                        />
                        <FormHelperText error>{errors.soluong}</FormHelperText>
                    </TableCell>

                    <TableCell>
                        <FormControl variant="outlined" fullWidth>
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
                                onClick={handleSubmit}
                            >
                                <Save />
                            </IconButton>
                            <IconButton onClick={onRemove}>
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
                    <Button onClick={() => updateDongia(mathang.giaban)}>
                        {formatter.format(mathang.giaban)}
                    </Button>
                )}
            </TableCell>
            <TableCell>{formatter.format(dongia)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

const SavedRow = ({ chitiet, value, index }) => {
    return (
        <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                {value.mathang.loaihang.ten} {chitiet && value.mathang.ma}
            </TableCell>
            <TableCell>{value.mathang.donvi.ten}</TableCell>
            <TableCell>{dayjs(value.mathang.hsd).format('DD/MM/YYYY')}</TableCell>
            <TableCell>{value.soluong || 1}</TableCell>
            <TableCell>{formatter.format(value.mathang.giaban)}</TableCell>
            <TableCell>{formatter.format(value.thanhtien || value.mathang.giaban)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

const AddKhuyenMaiGiamModal = ({ open, onClose, onSubmit }) => {
    const { data: khuyenmaigiam, isLoading } = useQuery([], khuyenmaigiamService.getAllKMG);

    const fixedKhuyenmaigiam = khuyenmaigiam || [];

    return (
        <Dialog open={open} fullWidth onClose={onClose}>
            <DialogTitle>Thêm khuyến mãi giảm</DialogTitle>

            <DialogContent>
                <DataGrid
                    sx={{ height: 400 }}
                    loading={isLoading}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã khuyến mãi',
                            flex: 1,
                        },
                        {
                            field: 'ten',
                            headerName: 'Tên khuyến mãi',
                            flex: 1,
                        },
                        {
                            field: 'tile',
                            headerName: 'Tỷ lệ giảm',
                            flex: 1,
                            renderCell({ value }) {
                                return `${Math.imul(value * 100, 1)}%`;
                            },
                        },
                        {
                            field: 'select',
                            type: 'actions',
                            headerName: 'Chọn',
                            flex: 1,
                            getActions(params) {
                                return [
                                    <GridActionsCellItem
                                        label="select"
                                        icon={<PanToolAlt />}
                                        onClick={() => {
                                            onSubmit(params.row.ma);
                                            onClose();
                                        }}
                                    />,
                                ];
                            },
                        },
                    ]}
                    rows={fixedKhuyenmaigiam.map((e) => ({
                        ...e,
                        id: e.ma,
                    }))}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    hideFooter
                    density="compact"
                />
            </DialogContent>
        </Dialog>
    );
};
const AddKhuyenMaiTangModal = ({ open, onClose, onSubmit }) => {
    const { data: khuyenmaitang, isLoading } = useQuery(
        ['khuyenmaitang'],
        khuyenmaitangService.getAllKMT
    );

    const fixedKhuyenmaigiam = khuyenmaitang || [];

    return (
        <Dialog open={open} fullWidth onClose={onClose}>
            <DialogTitle>Thêm khuyến mãi tặng</DialogTitle>

            <DialogContent>
                <DataGrid
                    sx={{ height: 400 }}
                    loading={isLoading}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã khuyến mãi',
                            flex: 1,
                        },
                        {
                            field: 'ten',
                            headerName: 'Tên khuyến mãi',
                            flex: 1,
                        },
                        {
                            field: 'select',
                            type: 'actions',
                            headerName: 'Chọn',
                            flex: 1,
                            getActions(params) {
                                return [
                                    <GridActionsCellItem
                                        label="select"
                                        icon={<PanToolAlt />}
                                        onClick={() => {
                                            onSubmit(params.row.ma);
                                            onClose();
                                        }}
                                    />,
                                ];
                            },
                        },
                    ]}
                    rows={fixedKhuyenmaigiam.map((e) => ({
                        ...e,
                        id: e.ma,
                    }))}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    hideFooter
                    density="compact"
                />
            </DialogContent>
        </Dialog>
    );
};

function ChinhSuaHoaDon() {
    const navigate = useNavigate();
    const params = useParams();
    const [chitiet, setChitiet] = useState(false);
    const [kmg, setKmg] = useState(null);
    const [kmt, setKMT] = useState(null);

    const {
        data: phieuxuat,
        isLoading,
        refetch,
    } = useQuery([params.ma, chitiet], () =>
        HoaDonXuatService.layMotHoaDon(params.ma, { chitiet }).then((res) => res.data)
    );

    const { data: chitietKMG } = useQuery([kmg], () => khuyenmaigiamService.layKMG(kmg));
    const { data: chitietKMT } = useQuery([kmt], () => khuyenmaitangService.getKMT(kmt));
    const { data: mathang } = useQuery(['tatcamathang', {}], productcategoryservice.getAllMatHang);

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
    const [thue, setThue] = useState(0);

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
                kmg,
                kmt,
                thue,
            });
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            handleCloseSaveModal();
            refetch();
        }
    };

    const [showAddKhuyenmaigiam, setShowAddKhuyenmaigiam] = useState(false);
    const [showAddKhuyenmaitang, setShowAddKhuyenmaitang] = useState(false);

    const handleOpenAddKhuyenmaigiam = () => setShowAddKhuyenmaigiam(true);
    const handleOpenAddKhuyenmaitang = () => setShowAddKhuyenmaitang(true);
    const handleCloseAddOpenKhuyenmaigiam = () => setShowAddKhuyenmaigiam(false);
    const handleCloseAddOpenKhuyenmaitang = () => setShowAddKhuyenmaitang(false);

    const fixedMathang = mathang || { total: 0, data: [] };

    const fixedChitietKMG = phieuxuat?.kmg || chitietKMG;
    const fixedChitietKMT = phieuxuat?.kmt || chitietKMT;

    const [missing, setMissing] = useState([]);

    useEffect(() => {
        const checkTang = async () => {
            if (!kmt) return;
            try {
                await HoaDonXuatService.checkHangTang({
                    manual: selectedManual.map((e) => ({
                        mh: e,
                    })),
                    auto: autoRows.filter((e) => e.madv),
                    maKMT: kmt,
                });
                setMissing([]);
            } catch (err) {
                setMissing(err.response.data.missing);
            }
        };
        checkTang();
    }, [autoRows, selectedManual, kmt]);

    if (isLoading) return <LinearProgress />;

    let giamgia = 0;

    if (phieuxuat) {
        giamgia = phieuxuat.npp.chietkhau;
    }

    if (fixedChitietKMG?.tile > giamgia) {
        giamgia = fixedChitietKMG.tile;
    }

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

                <Table>
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

                <Table>
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
                            <TableCell>{phieuxuat.npp?.ten}</TableCell>
                            <TableCell>{phieuxuat.npp.sdt}</TableCell>
                            <TableCell>
                                {ProvinceService.findByCode(phieuxuat.npp.tinh)?.name}
                            </TableCell>
                            <TableCell>{Math.imul(phieuxuat.npp.chietkhau * 100, 1)}%</TableCell>
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

                <Table>
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
                                        onClick={handleOpenManualModal}
                                    >
                                        Thêm thủ công
                                    </Button>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={6}>Thuế</TableCell>
                                <TableCell colSpan={2}>
                                    <TextField
                                        fullWidth
                                        label="Thuế (%)"
                                        placeholder="Thuế (%)"
                                        type="number"
                                        value={thue * 100}
                                        onChange={(event) => setThue(+event.target.value / 100)}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={6}>Tổng</TableCell>
                                <TableCell colSpan={2}>
                                    {formatter.format(
                                        phieuxuat.daluu
                                            ? phieuxuat.tongtien
                                            : (1 - giamgia) *
                                                  (autoRows.reduce(
                                                      (prev, current) =>
                                                          prev + current.giaban * current.soluong,
                                                      0
                                                  ) +
                                                      Object.keys(manualDongia).reduce(
                                                          (prev, current) =>
                                                              prev + manualDongia[current],
                                                          0
                                                      )) *
                                                  (1 + thue)
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {phieuxuat.chitiet.map((value, index) => (
                                <SavedRow
                                    chitiet={chitiet}
                                    index={index}
                                    key={index}
                                    value={value}
                                />
                            ))}
                            <TableRow>
                                <TableCell colSpan={8}>Hàng Tặng</TableCell>
                            </TableRow>
                            {phieuxuat.chitiettang.map((value, index) => (
                                <SavedRow
                                    chitiet={chitiet}
                                    index={index}
                                    key={index}
                                    value={value}
                                />
                            ))}

                            <TableRow>
                                <TableCell colSpan={6}>Thuế</TableCell>
                                <TableCell colSpan={2}>
                                    {(phieuxuat.thue * 100).toFixed(2)}%
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={6}>Tổng</TableCell>
                                <TableCell colSpan={2}>
                                    {formatter.format(phieuxuat.tongtien)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>

                <Typography variant="subtitle2">Khuyến mãi</Typography>

                <Grid container>
                    {fixedChitietKMG && (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <MainCard
                                shadow
                                title={fixedChitietKMG.ten}
                                secondary={
                                    !phieuxuat.daluu && (
                                        <IconButton onClick={() => setKmg(null)}>
                                            <IconX />
                                        </IconButton>
                                    )
                                }
                            >
                                <Typography variant="subtitle1">
                                    Mã khuyến mãi: {fixedChitietKMG.ma}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tỷ lệ giảm: {Math.imul(fixedChitietKMG.tile * 100, 1)}%
                                </Typography>
                            </MainCard>
                        </Grid>
                    )}
                    {fixedChitietKMT?.chitiet && (
                        <Grid item xs={12}>
                            <MainCard
                                shadow
                                title={fixedChitietKMT.ten}
                                secondary={
                                    !phieuxuat.daluu && (
                                        <IconButton onClick={() => setKMT(null)}>
                                            <IconX />
                                        </IconButton>
                                    )
                                }
                            >
                                <Typography variant="subtitle1">
                                    Mã khuyến mãi: {fixedChitietKMT.ma}
                                </Typography>
                                <DataGrid
                                    columns={[
                                        {
                                            field: 'lh',
                                            headerName: 'Loại Hàng',
                                            renderCell: ({ value }) => value.ten,
                                        },
                                        {
                                            field: 'dvmua',
                                            headerName: 'Đơn vị mua',
                                            renderCell: ({ value }) => value.ten,
                                        },
                                        {
                                            field: 'dvtang',
                                            headerName: 'Đơn vị tặng',
                                            renderCell: ({ value }) => value.ten,
                                        },
                                        { field: 'soluongmua', headerName: 'Số lượng mua' },
                                        { field: 'soluongtang', headerName: 'Số lượng tặng' },
                                    ]}
                                    rows={fixedChitietKMT.chitiet.map((row, index) => ({
                                        id: index,
                                        ...row,
                                    }))}
                                    hideFooter
                                    autoHeight
                                    density="compact"
                                ></DataGrid>
                            </MainCard>
                        </Grid>
                    )}
                </Grid>

                {!phieuxuat.daluu && (
                    <>
                        <Button startIcon={<LocalOffer />} onClick={handleOpenAddKhuyenmaigiam}>
                            Thêm khuyến mãi giảm
                        </Button>
                        <Button startIcon={<GifBox />} onClick={handleOpenAddKhuyenmaitang}>
                            Thêm khuyến mãi tặng
                        </Button>
                    </>
                )}

                {missing.length > 0 && (
                    <Alert
                        action={
                            <Button
                                onClick={() => {
                                    window.open('/hanghoa/mathang');
                                }}
                            >
                                Phân rã mặt hàng
                            </Button>
                        }
                        severity="warning"
                    >
                        Các sản phẩm sau đây không đủ số lượng tặng
                        <ul>
                            {missing.map((donvi) => {
                                return (
                                    <li
                                        key={donvi.ma}
                                    >{`${donvi.loaihang.ten} thiếu: ${donvi.soluong} ${donvi.ten}`}</li>
                                );
                            })}
                        </ul>
                    </Alert>
                )}

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

            <AddKhuyenMaiGiamModal
                open={showAddKhuyenmaigiam}
                onClose={handleCloseAddOpenKhuyenmaigiam}
                onSubmit={setKmg}
            />
            <AddKhuyenMaiTangModal
                open={showAddKhuyenmaitang}
                onClose={handleCloseAddOpenKhuyenmaitang}
                onSubmit={setKMT}
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
