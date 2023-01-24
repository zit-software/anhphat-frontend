import { Card, Grid, LinearProgress, Pagination, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import TonKhoService from 'services/tonkho.service';
import MainCard from 'ui-component/cards/MainCard';

const DashboardStorage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { data: allMHCloseToExpired, isLoading } = useQuery(['closeExpired', currentPage], () =>
        TonKhoService.getMHCloseToExpired(currentPage)
    );
    const { data: allLHOutOfStock, isLoading: isLoadingStock } = useQuery(['closeOutOfStock'], () =>
        TonKhoService.getLHOutOfStock()
    );
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
                            {allMHCloseToExpired.data.map((mh) => (
                                <Grid key={mh.ma} item xs={4} sm={3} md={2}>
                                    <Card sx={{ padding: '12px' }} elevation={6}>
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
                                            <b style={{ marginRight: '4px' }}>Hạn Sử Dụng</b>
                                            {dayjs(mh.hsd).format('DD/MM/YYYY')}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid justifyContent="center" container item>
                            <Pagination
                                onChange={(e, page) => setCurrentPage(page - 1)}
                                count={Math.ceil(allMHCloseToExpired.total / 10)}
                            ></Pagination>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid xs={12} item>
                <MainCard title="Các mặt hàng còn ít số lượng">
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
        </Grid>
    );
};
export default DashboardStorage;
