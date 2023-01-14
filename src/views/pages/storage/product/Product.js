import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
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
    TableRow
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import dayjs from 'dayjs';

const Product = () => {
    const [selected, setSelected] = useState({
        malh: '',
        madv: ''
    });
    const [donViToChoose, setDonViToChoose] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const { data: allcategories } = useQuery(
        ['allProductsCategory'],
        productcategoryservice.getAllCategoriesAndDonvi,
        { initialData: [] }
    );
    const { data: allMatHang, refetch: refetchAllMH } = useQuery(
        ['allMH', { ...selected, order: selectedOrder }],
        productcategoryservice.getAllMatHang,
        { enabled: false, initialData: [] }
    );

    const handleSearch = () => {
        refetchAllMH();
    };
    const handleReset = () => {
        setSelected({
            malh: '',
            madv: ''
        });
        setSelectedOrder('');
    };
    return (
        <MainCard title="Mặt Hàng Tồn Kho">
            <Grid alignItems="center" gap={[2, 2]} container>
                <Grid item container xs={12}>
                    <Grid textAlign="center" justifyContent="center" item xs={3}>
                        Tìm Kiếm
                    </Grid>
                    <Grid textAlign="center" justifyContent="center" item xs={4}>
                        Sắp Xếp Theo
                    </Grid>
                </Grid>

                <Grid gap={[0, 2]} justifyContent="center" item container xs={3}>
                    <Grid item xs={5}>
                        <FormControl fullWidth>
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
                    </Grid>
                    <Grid item xs={5}>
                        <FormControl fullWidth>
                            <InputLabel id="donvi">Đơn Vị</InputLabel>
                            <Select
                                onChange={(e) => {
                                    setSelected({ ...selected, madv: e.target.value });
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
                    </Grid>
                </Grid>
                <Grid gap={[0, 2]} justifyContent="center" item container xs={4}>
                    <Grid justifyContent="center" item xs={12}>
                        <FormControl fullWidth>
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
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <div style={{ display: 'flex', columnGap: '4px' }}>
                        <Button
                            onClick={() => {
                                handleSearch();
                            }}
                            variant="contained"
                        >
                            Tìm Kiếm
                        </Button>
                        <Button
                            onClick={() => {
                                handleReset();
                            }}
                            variant="contained"
                            color="info"
                        >
                            Đặt Lại
                        </Button>
                    </div>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
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
                        {allMatHang.map((mh) => (
                            <TableRow key={mh.ma}>
                                <TableCell>{mh.loaihang.ten}</TableCell>
                                <TableCell>{mh.donvi.ten}</TableCell>
                                <TableCell>{mh.soluong}</TableCell>
                                <TableCell>{dayjs(mh.ngaynhap).format('DD-MM-YYYY')}</TableCell>
                                <TableCell>{dayjs(mh.hsd).format('DD-MM-YYYY')}</TableCell>
                                <TableCell>{mh.gianhap}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};
export default Product;
