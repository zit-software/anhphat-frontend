import { DatePicker } from '@mui/x-date-pickers';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import dayjs from 'dayjs';

const Product = () => {
    const [selected, setSelected] = useState({
        malh: '',
        madv: '',
        ngaynhap: ''
    });
    const { data: allcategories } = useQuery(
        ['allProductsCategory'],
        productcategoryservice.getAllCategoriesAndDonvi,
        { initialData: [] }
    );
    const [donViToChoose, setDonViToChoose] = useState([]);
    return (
        <MainCard title="Mặt Hàng Tồn Kho">
            <Grid gap={[0, 2]} alignItems="center" container>
                <Grid item xs={2}>
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
                <Grid item xs={2}>
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
                <Grid item xs={3}>
                    <DatePicker
                        inputFormat="DD/MM/YY"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        label="Ngày Nhập Hàng"
                        onChange={(value) => {
                            setSelected({
                                ...selected,
                                ngaynhap: dayjs(value).format('DD-MM-YYYY')
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained">Tìm Kiếm</Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead></TableHead>
                    <TableBody></TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};
export default Product;
