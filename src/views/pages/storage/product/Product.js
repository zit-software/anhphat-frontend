import { AutoFixNormalOutlined, DeleteOutline } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import MainCard from 'ui-component/cards/MainCard';
import formatter from 'views/utilities/formatter';
import PhanRaModal from './PhanRaModal';
import * as Yup from 'yup';
const Product = () => {
    const [selected, setSelected] = useState({
        malh: '',
        madv: '',
    });
    const [donViToChoose, setDonViToChoose] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const [selectedMHToPhanRa, setSelectedMHToPhanRa] = useState(null);
    const [selectedMHToPDelete, setSelectedMHToPDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [group, setGroup] = useState(false);
    const { data: allcategories } = useQuery(
        ['allProductsCategory'],
        productcategoryservice.getAllCategoriesAndDonvi,
        { initialData: [] }
    );
    const {
        data: allMatHang,
        isLoading,
        refetch: refetchAllMH,
    } = useQuery(
        ['allMH', { ...selected, order: selectedOrder, page: currentPage, group }],
        productcategoryservice.getAllMatHang,
        { enabled: false, initialData: { data: [], total: 0 } }
    );
    const columnsChiTiet = [
        {
            field: 'ma',
            headerName: 'Mã mặt hàng',
            flex: 0.5,
        },
        {
            field: 'loaihang',
            headerName: 'Loại hàng',
            flex: 1,
            renderCell: ({ value: { ten } }) => ten,
        },
        {
            field: 'donvi',
            headerName: 'Đơn vị',
            flex: 0.4,
            renderCell: ({ value: { ten } }) => ten,
        },
        {
            field: 'ngaynhap',
            headerName: 'Ngày nhập',
            flex: 1,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'hsd',
            headerName: 'Hạn sử dụng',
            flex: 1,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'gianhap',
            headerName: 'Giá nhập',
            flex: 1,
            renderCell: ({ value }) => formatter.format(value),
        },
        {
            field: 'giaxuat',
            headerName: 'Giá xuất',
            renderCell({ row }) {
                return formatter.format(row.donvi.giaban);
            },
        },
        {
            field: 'unpack',
            type: 'actions',
            headerName: 'Phân rã',
            getActions(params) {
                return [
                    <GridActionsCellItem
                        label="Phân rã"
                        icon={<AutoFixNormalOutlined color="info" />}
                        onClick={() => {
                            setSelectedMHToPhanRa(params.row);
                        }}
                    />,
                ];
            },
            flex: 0.5,
        },
        {
            field: 'delete',
            type: 'actions',
            headerName: 'Xóa Bỏ',
            getActions(params) {
                return [
                    <GridActionsCellItem
                        label="Xóa Bỏ"
                        icon={<DeleteOutline color="error" />}
                        onClick={() => {
                            setSelectedMHToPDelete(params.row);
                        }}
                    />,
                ];
            },
            flex: 0.5,
        },
    ];

    const columnsGroup = [
        {
            field: 'loaihang',
            headerName: 'Loại hàng',
            flex: 1,
            renderCell: ({ value: { ten } }) => ten,
        },
        {
            field: 'donvi',
            headerName: 'Đơn vị',
            flex: 1,
            renderCell: ({ value: { ten } }) => ten,
        },
        {
            field: 'ngaynhap',
            headerName: 'Ngày nhập',
            flex: 1,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'hsd',
            headerName: 'Hạn sử dụng',
            flex: 1,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'soluong',
            headerName: 'Số Lượng',
            flex: 1,
        },
        {
            field: 'gianhap',
            headerName: 'Giá nhập',
            flex: 1,
            renderCell: ({ row }) => formatter.format(row.donvi.gianhap) || 0,
        },
        {
            field: 'giaxuat',
            headerName: 'Giá xuất',
            renderCell({ row }) {
                return formatter.format(row.donvi.giaban) || 0;
            },
        },
    ];
    const rowsChiTiet = allMatHang.data.map((e) => ({
        ...e,
        id: e.ma,
    }));

    const rowsGroup = allMatHang.data.map((e) => ({
        ...e,
        id: parseInt(Math.random() * 100000000),
    }));

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, group, selectedOrder, selected]);
    const handleSearch = () => {
        refetchAllMH();
    };
    const handleReset = () => {
        setSelected({
            malh: '',
            madv: '',
        });
        setSelectedOrder('');
        setCurrentPage(0);
    };
    const handleClosePhanRa = () => {
        setSelectedMHToPhanRa(null);
    };
    const handleSubmitPhanRa = async (value) => {
        await productcategoryservice.phanra(value);
        alert(`Phân rã thành công mặt hàng với mã ${value.ma}`);
        handleClosePhanRa();
    };
    const handleDelete = async (value) => {
        const data = await productcategoryservice.xoamathang(selectedMHToPDelete.ma);
        setSelectedMHToPDelete(null);
        alert(data.msg);
        refetchAllMH();
    };
    if (isLoading) return <LinearProgress />;
    return (
        <MainCard title="Mặt Hàng Tồn Kho">
            <Grid container spacing={2}>
                <Grid item md={2}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Tìm kiếm</Typography>

                        <FormControl fullWidth size="small">
                            <InputLabel id="loaihang">Loại Hàng</InputLabel>
                            <Select
                                value={selected.malh}
                                fullWidth
                                labelId="loaihang"
                                label="Loại Hàng"
                                onChange={(e) => {
                                    const malh = e.target.value;
                                    setSelected({ ...selected, malh });
                                    const donvis = allcategories.find(
                                        (loaihang) => loaihang.ma === malh
                                    )?.donvi;
                                    setDonViToChoose(donvis);
                                    setCurrentPage(1);
                                }}
                            >
                                {allcategories.map((category) => {
                                    return (
                                        <MenuItem key={category.ma} value={category.ma}>
                                            {category.ten}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel id="donvi">Đơn Vị</InputLabel>
                            <Select
                                onChange={(e) => {
                                    setSelected({ ...selected, madv: e.target.value });
                                    setCurrentPage(1);
                                }}
                                value={selected.madv}
                                fullWidth
                                labelId="donvi"
                                label="Đơn Vị"
                                disabled={!selected.malh}
                            >
                                {donViToChoose.map((dv) => {
                                    return (
                                        <MenuItem key={dv.ma} value={dv.ma}>
                                            {dv.ten}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <Typography variant="subtitle1">Sắp xếp theo</Typography>

                        <FormControl fullWidth size="small">
                            <RadioGroup
                                onChange={(e) => {
                                    setSelectedOrder(e.target.value);
                                    if (e.target.value === 'soluong') setGroup(true);
                                }}
                                value={selectedOrder}
                                row
                                aria-labelledby="radio-order"
                            >
                                <FormControlLabel
                                    value="hsd"
                                    control={<Radio />}
                                    label="Hạn Sử Dụng"
                                />
                                <FormControlLabel
                                    value="ngaynhap"
                                    control={<Radio />}
                                    label="Ngày Nhập"
                                />
                                <FormControlLabel
                                    value="soluong"
                                    control={<Radio />}
                                    label="Số Lượng"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                handleReset();
                                setGroup(!group);
                            }}
                            color="primary"
                        >
                            {!group ? 'Xem Gộp' : 'Xem Chi Tiết'}
                        </Button>
                        <Button
                            size="small"
                            onClick={() => {
                                handleReset();
                            }}
                            color="info"
                        >
                            Đặt Lại
                        </Button>
                    </Stack>
                </Grid>

                <Grid item md={10}>
                    <Box sx={{ height: '60vh', width: '100%' }}>
                        <DataGrid
                            columns={group ? columnsGroup : columnsChiTiet}
                            rows={rowsChiTiet ? rowsGroup : rowsChiTiet}
                            loading={isLoading}
                            autoPageSize
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            density="compact"
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            paginationMode="server"
                            rowCount={allMatHang.total}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                            }}
                            pageSize={20}
                            page={currentPage}
                            initialState={{
                                pagination: {
                                    page: currentPage,
                                    pageSize: 20,
                                },
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
            <PhanRaModal
                value={selectedMHToPhanRa}
                open={!!selectedMHToPhanRa}
                onClose={handleClosePhanRa}
                onSubmit={handleSubmitPhanRa}
            />
            <Dialog open={!!selectedMHToPDelete} onClose={() => setSelectedMHToPDelete(null)}>
                <Formik
                    initialValues={{ accept: false }}
                    validationSchema={Yup.object().shape({
                        accept: Yup.bool().equals([true], 'Vui lòng xác nhận để xóa hóa đơn'),
                    })}
                    onSubmit={handleDelete}
                >
                    {({ values, handleChange, errors, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle>Tiêu hủy mặt hàng</DialogTitle>
                            <DialogContent sx={{ maxWidth: 360 }}>
                                <DialogContentText>
                                    Bạn chắc chắn muốn tiêu hủy mặt hàng này?
                                </DialogContentText>
                                <DialogContentText>
                                    Điều này có thể ảnh hưởng tới các mặt hàng cũng như dữ liệu tồn
                                    kho của cửa hàng.
                                </DialogContentText>

                                <FormControlLabel
                                    label="Xác nhận tiêu hủy mặt hàng này"
                                    name="accept"
                                    value={values.accept}
                                    control={<Checkbox />}
                                    onChange={handleChange}
                                />

                                <FormHelperText error>{errors.accept}</FormHelperText>
                            </DialogContent>

                            <DialogActions>
                                <Button type="submit" variant="contained" color="error">
                                    Tiêu hủy
                                </Button>
                                <Button
                                    type="button"
                                    color="inherit"
                                    onClick={() => setSelectedMHToPDelete(null)}
                                >
                                    Hủy
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </MainCard>
    );
};
export default Product;
