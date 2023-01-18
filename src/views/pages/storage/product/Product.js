import { AutoFixNormalOutlined } from '@mui/icons-material';
import {
    Button,
    FormControl,
    FormControlLabel,
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
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import MainCard from 'ui-component/cards/MainCard';
import formatter from 'views/utilities/formatter';

const Product = () => {
    const [selected, setSelected] = useState({
        malh: '',
        madv: '',
    });
    const [donViToChoose, setDonViToChoose] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
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
        ['allMH', { ...selected, order: selectedOrder, page: currentPage, group: 'true' }],
        productcategoryservice.getAllMatHang,
        { enabled: false, initialData: { data: [], total: 0 } }
    );
    const columnsChiTiet = [
        {
            field: 'ma',
            headerName: 'Mã mặt hàng',
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
            field: 'actions',
            type: 'actions',
            headerName: 'Phân rã',
            getActions(params) {
                return [
                    <GridActionsCellItem
                        label="Phân rã"
                        icon={<AutoFixNormalOutlined />}
                        onClick={() => {}}
                    />,
                ];
            },
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
    }, [currentPage, group]);
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
    if (isLoading) return <LinearProgress />;
    console.log(allMatHang);
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
                            color="secondary"
                        >
                            {!group ? 'Xem Gộp' : 'Xem Chi Tiết'}
                        </Button>
                        <Button
                            size="small"
                            onClick={() => {
                                handleSearch();
                            }}
                            variant="contained"
                            color="primary"
                        >
                            Tìm Kiếm
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
                            columns={[
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
                                    headerName: 'Số lượng',
                                    flex: 1,
                                },
                                {
                                    field: 'gianhap',
                                    headerName: 'Giá nhập',
                                    flex: 1,
                                    renderCell: ({ row }) => formatter.format(row.donvi.gianhap),
                                },
                                {
                                    field: 'giaxuat',
                                    headerName: 'Giá xuất',
                                    renderCell({ row }) {
                                        return formatter.format(row.donvi.giaban);
                                    },
                                },
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    headerName: 'Phân rã',
                                    getActions(params) {
                                        return [
                                            <GridActionsCellItem
                                                label="Phân rã"
                                                icon={<AutoFixNormalOutlined />}
                                                onClick={() => {}}
                                            />,
                                        ];
                                    },
                                },
                            ]}
                            rows={allMatHang.data.map((e) => ({
                                ...e,
                                id: parseInt(Math.random() * 1000000),
                            }))}
                            loading={isLoading}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            density="compact"
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            paginationMode="server"
                            rowsPerPageOptions={[20]}
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
        </MainCard>
    );
};
export default Product;
