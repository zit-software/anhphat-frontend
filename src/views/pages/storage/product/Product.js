import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import MainCard from 'ui-component/cards/MainCard';

const Product = () => {
    const [selected, setSelected] = useState({
        malh: '',
        madv: '',
    });
    const [donViToChoose, setDonViToChoose] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

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
        ['allMH', { ...selected, order: selectedOrder, page: currentPage }],
        productcategoryservice.getAllMatHang,
        { enabled: false, initialData: { data: [], total: 0 } }
    );

    useEffect(() => {
        refetchAllMH();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    const handleSearch = () => {
        setCurrentPage(0);
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
    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <MainCard title="Mặt Hàng Tồn Kho">
            <Grid container spacing={2}>
                <Grid item md={4}>
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

                <Grid item md={8}>
                    <TablePagination
                        size="small"
                        component="div"
                        count={allMatHang.total}
                        rowsPerPageOptions={[10]}
                        rowsPerPage={10}
                        page={Math.min(currentPage, allMatHang.total)}
                        onPageChange={handleChangePage}
                        showLastButton
                        showFirstButton
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
                        }
                    />
                    <TableContainer sx={{ maxHeight: '70vh' }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Loại Hàng</TableCell>
                                    <TableCell>Đơn Vị</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                    <TableCell>Ngày Nhập</TableCell>
                                    <TableCell>Hạn Sử Dụng</TableCell>
                                    <TableCell>Giá Nhập</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allMatHang.data.map((mh, index) => {
                                    return (
                                        <TableRow key={index} hover>
                                            <TableCell>{mh.loaihang.ten}</TableCell>
                                            <TableCell>{mh.donvi.ten}</TableCell>
                                            <TableCell>{mh.soluong}</TableCell>
                                            <TableCell>
                                                {dayjs(mh.ngaynhap).format('DD-MM-YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(mh.hsd).format('DD-MM-YYYY')}
                                            </TableCell>
                                            <TableCell>{mh.gianhap}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </MainCard>
    );
};
export default Product;
