// material-ui

import { Grid, LinearProgress } from '@mui/material';
import { Stack } from '@mui/system';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';
import { DateRangePicker } from 'react-date-range';
import { useQuery } from 'react-query';
import { it, vi } from 'react-date-range/dist/locale';
import { addDays, endOfMonth, startOfMonth, subDays } from 'date-fns';

import ThongKeService from 'services/thongke.service';
import MainCard from 'ui-component/cards/MainCard';
import formatter from 'views/utilities/formatter';
import ChiCard from './ChiCard';
import DoanhThuCard from './DoanhThuCard';
import ThuCard from './ThuCard';
import { useState } from 'react';

// project imports

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const { data: thongke, isLoading } = useQuery(['thongke'], () =>
        ThongKeService.thongketheongay().then((res) => res.data)
    );

    const thongkeTheoNgay = thongke?.data || [];

    const [selectedDays, setSelectedDays] = useState([
        {
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date()),
            key: 'selection',
        },
    ]);

    if (isLoading) return <LinearProgress />;

    return (
        <MainCard title="Thống kê">
            <DateRangePicker
                showPreview
                ranges={selectedDays}
                locale={vi}
                scroll={{ enabled: true }}
                onChange={(item) => {
                    setSelectedDays([item.selection]);
                }}
            />
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <ReactApexChart
                        options={{
                            noData: {
                                text: 'Chưa có dữ liệu',
                            },
                            title: {
                                text: 'Thống kê thu chi',
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            chart: {
                                toolbar: {
                                    show: false,
                                },
                            },
                            grid: {
                                show: false,
                            },
                            stroke: {
                                width: 1,
                                curve: 'smooth',
                            },
                            xaxis: {
                                categories: thongkeTheoNgay.map((e) => e.ngay),
                                labels: {
                                    formatter(value) {
                                        return dayjs(value).format('DD/MM/YYYY');
                                    },
                                },
                            },
                            yaxis: {
                                labels: {
                                    formatter(value) {
                                        return formatter.format(value);
                                    },
                                },
                                max: thongke.max,
                            },
                        }}
                        series={[
                            {
                                name: 'Thu',
                                data: thongkeTheoNgay.map((e) => e.thu || 0),
                            },
                            {
                                name: 'Chi',
                                data: thongkeTheoNgay.map((e) => e.chi || 0),
                            },
                            {
                                name: 'Doanh thu',
                                data: thongkeTheoNgay.map((e) => e.conlai || 0),
                            },
                        ]}
                        type="line"
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                        <ThuCard tongthu={thongke.tongthu} />
                        <ChiCard tongchi={thongke.tongchi} />
                        <DoanhThuCard doanhthu={thongke.doanhthu} />
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Dashboard;
