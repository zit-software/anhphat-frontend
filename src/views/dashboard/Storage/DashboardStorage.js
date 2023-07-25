import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    Grid,
    LinearProgress,
    Pagination,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import TonKhoService from 'services/tonkho.service';
import MainCard from 'ui-component/cards/MainCard';
import * as Yup from 'yup';

const DashboardStorage = () => {
    const [selectedMHToPDelete, setSelectedMHToPDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const {
        data: allMHCloseToExpired,
        isLoading,
        refetch: refetchSapHetHan,
    } = useQuery(['closeExpired', currentPage], () =>
        TonKhoService.getMHCloseToExpired(currentPage)
    );
    const { data: allLHOutOfStock, isLoading: isLoadingStock } = useQuery(['closeOutOfStock'], () =>
        TonKhoService.getLHOutOfStock()
    );
    const handleDelete = async (value) => {
        await productcategoryservice.xoamathang(selectedMHToPDelete.ma);
        setSelectedMHToPDelete(null);
        refetchSapHetHan();
    };
    if (isLoading || isLoadingStock) return <LinearProgress />;
    return (
        <Grid container gap={[2, 8]}>
            <Grid xs={12} item>
                <MainCard title="Các mặt hàng sắp hết hạn sử dụng">
                    <Grid gap={[2, 2]} container>
                        <Grid
                            sx={{ minHeight: '50vh' }}
                            gap={[2, 2]}
                            justifyContent="center"
                            container
                            item
                        >
                            {allMHCloseToExpired.data.length > 0 ? (
                                allMHCloseToExpired.data.map((mh) => (
                                    <Grid key={mh.ma} item xs={4} sm={3} md={2}>
                                        <Card elevation={6}>
                                            <CardContent sx={{ padding: '12px' }}>
                                                <Typography>
                                                    <b style={{ marginRight: '4px' }}>Mã</b>
                                                    {mh.ma}
                                                </Typography>
                                                <Typography>
                                                    <b style={{ marginRight: '4px' }}>Loại Hàng</b>
                                                    {mh.loaihang.ten}
                                                </Typography>
                                                <Typography>
                                                    <b style={{ marginRight: '4px' }}>Đơn Vị</b>
                                                    {mh.donvi.ten}
                                                </Typography>
                                                <Typography>
                                                    <b style={{ marginRight: '4px' }}>Ngày Nhập</b>
                                                    {dayjs(mh.ngaynhap).format('DD/MM/YYYY')}
                                                </Typography>
                                                <Typography>
                                                    <b style={{ marginRight: '4px' }}>
                                                        Hạn Sử Dụng
                                                    </b>
                                                    {
                                                        <span
                                                            style={{
                                                                padding: '1px 3px',
                                                                borderRadius: '4px',
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            {dayjs(mh.hsd).format('DD/MM/YYYY')}
                                                        </span>
                                                    }
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ padding: '12px' }} disableSpacing>
                                                <Button
                                                    onClick={() => setSelectedMHToPDelete(mh)}
                                                    color="error"
                                                    variant="contained"
                                                >
                                                    Tiêu Hủy
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography>
                                    Không có mặt hàng nào sắp hết hạn sử dụng (Trong 1 tháng tới)
                                </Typography>
                            )}
                        </Grid>
                        <Grid justifyContent="center" container item>
                            <Pagination
                                page={currentPage + 1}
                                onChange={(e, page) => setCurrentPage(page - 1)}
                                count={Math.ceil(allMHCloseToExpired.total / 10)}
                            ></Pagination>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid xs={12} item>
                <MainCard title="Các loại hàng còn ít số lượng">
                    <ReactApexChart
                        options={{
                            chart: {
                                type: 'bar',
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            xaxis: {
                                categories: allLHOutOfStock.map((e) => e.ten),
                            },
                            plotOptions: {
                                bar: {
                                    distributed: true,
                                },
                            },
                        }}
                        type="bar"
                        series={[
                            {
                                data: allLHOutOfStock.map((e) => e.soluong),
                                name: 'Số lượng',
                            },
                        ]}
                        height={350}
                    />
                </MainCard>
            </Grid>
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
        </Grid>
    );
};
export default DashboardStorage;
