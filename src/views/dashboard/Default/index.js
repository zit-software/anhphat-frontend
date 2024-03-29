// material-ui

import {
    Button,
    Grid,
    LinearProgress,
    MenuItem,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
} from '@mui/material';
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
import { useCallback, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import productcategoryservice from 'services/productcategory.service';
import ProvinceService from 'services/province.service';

import { BugReportOutlined } from '@mui/icons-material';
import ThongKeService from 'services/thongke.service';
import MainCard from 'ui-component/cards/MainCard';
import formatter from 'views/utilities/formatter';
import ChiCard from './ChiCard';
import DoanhThuCard from './DoanhThuCard';
import RepairModal from './RepairModal';
import ThuCard from './ThuCard';

// project imports

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const currentUser = useSelector((state) => state.auth.user);

    const [isOpenRepairModal, setIsOpenRepairModal] = useState(false);

    const handleOpenRepairModal = () => {
        setIsOpenRepairModal(true);
    };

    const handleCloseRepairModal = () => {
        setIsOpenRepairModal(false);
    };

    const { data: allTinhs, isLoading: isLoadingAllTinh } = useQuery(['allTinh'], () =>
        ThongKeService.laytatcatinh()
    );
    const [ngaybd, setNgaybd] = useState(startOfYear(new Date()));
    const [ngaykt, setNgaykt] = useState(endOfYear(new Date()));
    const [currentTinh, setCurrentTinh] = useState(allTinhs?.length > 0 ? allTinhs[0] : null);
    useEffect(() => {
        if (allTinhs) {
            setCurrentTinh(allTinhs[0]);
        }
    }, [allTinhs]);

    const { data: thongke } = useQuery(['thongketheongay', ngaybd, ngaykt], () =>
        ThongKeService.thongketheongay({ ngaybd, ngaykt }).then((res) => res.data)
    );

    const { data: thongkeban } = useQuery(['thongkeban', ngaybd, ngaykt], () =>
        ThongKeService.thongketheoloaihangban({ ngaybd, ngaykt }).then((res) => res.data)
    );

    const { data: thongkenhap } = useQuery(['thongkenhap', ngaybd, ngaykt], () =>
        ThongKeService.thongketheoloaihangnhap({ ngaybd, ngaykt }).then((res) => res.data)
    );

    const { data: thongkeTinh, isLoading: isLoadingThongKeTinh } = useQuery(
        ['thongketinh', currentTinh, ngaybd, ngaykt],
        () => ThongKeService.thongketinh(currentTinh, ngaybd, ngaykt)
    );
    const { data: allLoaiHang, isLoading: isLoadingLH } = useQuery(['loaihang'], () =>
        productcategoryservice.getAllCategories()
    );

    const fixedThongkeban = thongkeban || [];
    const fixedThongkenhap = thongkenhap || [];

    const thongkeTheoNgay = thongke?.data || [];

    const updateThongKeTinh = useCallback(() => {
        if (!isLoadingLH && !isLoadingThongKeTinh) {
            let thongkeTinhRows = allLoaiHang.map((lh) => [
                {
                    ma: lh.ma,
                    ten: lh.ten,
                },
            ]);
            if (!thongkeTinh?.npp) return;
            for (let npp of thongkeTinh.npp) {
                for (let row of thongkeTinhRows) {
                    row.push(0);
                }
                for (let lh of npp.loaihang) {
                    const findIndex = thongkeTinhRows.findIndex((row) => row[0].ma === lh.ma);
                    const lastIndex = thongkeTinhRows[findIndex].length - 1;
                    thongkeTinhRows[findIndex][lastIndex] = lh.soluong;
                }
            }
            return thongkeTinhRows;
        }
        return [];
        // eslint-disable-next-line
    }, [currentTinh, ngaybd, ngaykt, isLoadingThongKeTinh]);

    let thongkeTinhRows = updateThongKeTinh();

    if (isLoadingAllTinh) return <LinearProgress />;
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <DatePicker
                                value={dayjs(ngaybd)}
                                onChange={({ $d }) => setNgaybd($d)}
                                inputFormat="DD/MM/YYYY"
                                label="Từ ngày"
                                placeholder="Ngày bắt đầu"
                                renderInput={(props) => <TextField {...props} />}
                            />
                        </Grid>

                        <Grid item>
                            <DatePicker
                                value={dayjs(ngaykt)}
                                onChange={({ $d }) => setNgaykt($d)}
                                inputFormat="DD/MM/YYYY"
                                label="Đến ngày"
                                placeholder="Ngày kết thúc"
                                renderInput={(props) => <TextField {...props} />}
                            />
                        </Grid>

                        <Grid item>
                            <Select
                                defaultValue="thisYear"
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
                </Grid>
                {currentUser.laAdmin && (
                    <>
                        <Grid item sm={12} lg={8} xl={8}>
                            <MainCard
                                title="Thống kê thu chi"
                                secondary={
                                    <Button
                                        variant="contained"
                                        startIcon={<BugReportOutlined />}
                                        onClick={handleOpenRepairModal}
                                    >
                                        Sửa lỗi thống kê
                                    </Button>
                                }
                            >
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
                        <Grid item sm={12} lg={4} xl={4}>
                            <Stack spacing={2}>
                                <ThuCard tongthu={thongke?.tongthu} />
                                <ChiCard tongchi={thongke?.tongchi} />
                                <DoanhThuCard doanhthu={thongke?.doanhthu} />
                            </Stack>
                        </Grid>
                    </>
                )}

                {currentTinh && (
                    <Grid item xs={12}>
                        <MainCard title="Thống kê theo tỉnh">
                            {isLoadingAllTinh || isLoadingThongKeTinh ? (
                                <LinearProgress />
                            ) : (
                                <TableContainer>
                                    <Grid container justifyContent="flex-end">
                                        <Tabs
                                            onChange={(e, value) => setCurrentTinh(value)}
                                            value={currentTinh}
                                            aria-label="basic tabs example"
                                        >
                                            {allTinhs.map((tinh) => (
                                                <Tab
                                                    label={ProvinceService.findByCode(tinh).name}
                                                    key={tinh}
                                                    value={tinh}
                                                ></Tab>
                                            ))}
                                        </Tabs>
                                    </Grid>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Loại Hàng</TableCell>
                                                {thongkeTinh.npp.map((npp) => (
                                                    <TableCell key={npp.ma}>{npp.ten}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {thongkeTinhRows.map((thongke, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        {thongke.map((col, index) => {
                                                            if (index === 0)
                                                                return (
                                                                    <TableCell key={index}>
                                                                        {col.ten}
                                                                    </TableCell>
                                                                );
                                                            return (
                                                                <TableCell key={index}>
                                                                    {col}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </MainCard>
                    </Grid>
                )}

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

            <RepairModal open={isOpenRepairModal} onClose={handleCloseRepairModal} />
        </>
    );
};

export default Dashboard;
