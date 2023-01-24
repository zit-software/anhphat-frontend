// material-ui

import { Grid, MenuItem, Select, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import {
    endOfDay,
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subYears,
} from 'date-fns';
import dayjs from 'dayjs';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';

import ThongKeService from 'services/thongke.service';
import MainCard from 'ui-component/cards/MainCard';
import formatter from 'views/utilities/formatter';
import ChiCard from './ChiCard';
import DoanhThuCard from './DoanhThuCard';
import ThuCard from './ThuCard';

// project imports

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [ngaybd, setNgaybd] = useState(startOfYear(new Date()));
    const [ngaykt, setNgaykt] = useState(endOfYear(new Date()));

    const { data: thongke } = useQuery(['thongketheongay', ngaybd, ngaykt], () =>
        ThongKeService.thongketheongay({ ngaybd, ngaykt }).then((res) => res.data)
    );

    const { data: thongkeban } = useQuery(['thongkeban', ngaybd, ngaykt], () =>
        ThongKeService.thongketheoloaihangban({ ngaybd, ngaykt }).then((res) => res.data)
    );

    const { data: thongkenhap } = useQuery(['thongkenhap', ngaybd, ngaykt], () =>
        ThongKeService.thongketheoloaihangnhap({ ngaybd, ngaykt }).then((res) => res.data)
    );

    const fixedThongkeban = thongkeban || [];
    const fixedThongkenhap = thongkenhap || [];

    console.log(fixedThongkeban);

    const thongkeTheoNgay = thongke?.data || [];

    return (
        <Grid container spacing={2}>
            <Grid item sm={12} lg={8} xl={9}>
                <MainCard title="Thống kê thu chi">
                    <Grid container spacing={1}>
                        <Grid item>
                            <DatePicker
                                value={ngaybd}
                                onChange={({ $d }) => setNgaybd($d)}
                                inputFormat="DD/MM/YYYY"
                                label="Từ ngày"
                                placeholder="Ngày bắt đầu"
                                renderInput={(props) => <TextField size="small" {...props} />}
                            />
                        </Grid>

                        <Grid item>
                            <DatePicker
                                value={ngaykt}
                                onChange={({ $d }) => setNgaykt($d)}
                                inputFormat="DD/MM/YYYY"
                                label="Đến ngày"
                                placeholder="Ngày kết thúc"
                                renderInput={(props) => <TextField size="small" {...props} />}
                            />
                        </Grid>

                        <Grid item>
                            <Select
                                defaultValue="thisYear"
                                size="small"
                                onChange={(event) => {
                                    const value = event.target.value;

                                    const now = new Date();

                                    switch (value) {
                                        case 'now':
                                            setNgaybd(startOfDay(now));
                                            setNgaykt(endOfDay(now));
                                            break;

                                        case 'thisWeek':
                                            setNgaybd(startOfWeek(now));
                                            setNgaykt(endOfWeek(now));
                                            break;

                                        case 'thisMonth':
                                            setNgaybd(startOfMonth(now));
                                            setNgaykt(endOfMonth(now));
                                            break;

                                        case 'thisYear':
                                            setNgaybd(startOfYear(now));
                                            setNgaykt(endOfYear(now));
                                            break;

                                        case 'lastYear':
                                            setNgaybd(startOfYear(subYears(now, 1)));
                                            setNgaykt(endOfYear(subYears(now, 1)));
                                            break;

                                        default:
                                            throw new Error('Invalid option: ' + value);
                                    }
                                }}
                            >
                                <MenuItem value="now">Hôm nay</MenuItem>
                                <MenuItem value="thisWeek">Tuần này</MenuItem>
                                <MenuItem value="thisMonth">Tháng này</MenuItem>
                                <MenuItem value="thisYear">Năm nay</MenuItem>
                                <MenuItem value="lastYear">Năm trước</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    <ReactApexChart
                        options={{
                            noData: {
                                text: 'Chưa có dữ liệu',
                            },
                            dataLabels: {
                                enabled: false,
                            },

                            stroke: {
                                width: 2,
                                curve: 'smooth',
                            },
                            xaxis: {
                                categories: thongkeTheoNgay.map((e) => e.ngay),
                                labels: {
                                    formatter(value) {
                                        return dayjs(value).format('HH:MM, DD/MM/YYYY');
                                    },
                                    show: false,
                                },
                            },
                            yaxis: {
                                labels: {
                                    formatter(value) {
                                        return formatter.format(value);
                                    },
                                },
                            },
                        }}
                        series={[
                            {
                                name: 'Thu',
                                data: thongkeTheoNgay.map((e) => e.thu || 0),
                                color: '#00d950',
                            },
                            {
                                name: 'Chi',
                                data: thongkeTheoNgay.map((e) => e.chi || 0),
                                color: '#e00026',
                            },
                            {
                                name: 'Doanh thu',
                                data: thongkeTheoNgay.map((e) => e.conlai || 0),
                                color: '#007be6',
                            },
                        ]}
                        type="line"
                        height={350}
                    />
                </MainCard>
            </Grid>

            <Grid item sm={12} lg={4} xl={3}>
                <Stack spacing={2}>
                    <ThuCard tongthu={thongke?.tongthu} />
                    <ChiCard tongchi={thongke?.tongchi} />
                    <DoanhThuCard doanhthu={thongke?.doanhthu} />
                </Stack>
            </Grid>

            <Grid item xs={12}>
                <MainCard title="Thống kê hàng nhập">
                    <ReactApexChart
                        options={{
                            chart: {
                                type: 'bar',
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            xaxis: {
                                categories: fixedThongkenhap.map((e) => e.loaihang.ten),
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
                                data: fixedThongkenhap.map((e) => e.soluong),
                                name: 'Số lượng',
                            },
                        ]}
                        height={350}
                    />
                </MainCard>
            </Grid>

            <Grid item xs={12}>
                <MainCard title="Thống kê hàng xuất">
                    <ReactApexChart
                        options={{
                            chart: {
                                type: 'bar',
                                height: 350,
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            xaxis: {
                                categories: fixedThongkeban.map((e) => e.loaihang.ten),
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
                                data: fixedThongkeban.map((e) => e.soluong),
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

export default Dashboard;
