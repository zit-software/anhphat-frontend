import {
    Badge,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import HoaDonXuatService from 'services/hoadonxuat.service';
import ProvinceService from 'services/province.service';
import MainCard from 'ui-component/cards/MainCard';

function ChinhSuaHoaDon() {
    const params = useParams();

    const { data: phieuxuat, isLoading } = useQuery([params.ma], () =>
        HoaDonXuatService.layMotHoaDon(params.ma).then((res) => res.data)
    );

    if (isLoading) return <LinearProgress />;

    return (
        <MainCard
            title={
                <Badge>
                    <Typography variant="h2">
                        Hóa đơn xuất{' '}
                        <span
                            style={{
                                color: '#aaa',
                            }}
                        >
                            #{params.ma}
                        </span>
                    </Typography>
                </Badge>
            }
        >
            <Stack spacing={2}>
                <Typography variant="subtitle2">Thông tin hóa đơn</Typography>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2}>Mã số hóa đơn</TableCell>
                            <TableCell rowSpan={2}>Tên hóa đơn</TableCell>
                            <TableCell rowSpan={2}>Ngày tạo</TableCell>
                            <TableCell colSpan={2} align="center">
                                Người tạo
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Mã nhân viên</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell>{phieuxuat.ma}</TableCell>
                            <TableCell>Hóa đơn xuất hàng</TableCell>
                            <TableCell>{dayjs(phieuxuat.createdAt).format('DD/MM/YYYY')}</TableCell>
                            <TableCell>{phieuxuat.nguoinhap.ma}</TableCell>
                            <TableCell>{phieuxuat.nguoinhap.ten}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="subtitle2">Thông tin nhà phân phối</Typography>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã nhà phân phối</TableCell>
                            <TableCell>Tên nhà phân phối</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Tỉnh thành</TableCell>
                            <TableCell>Chiết khấu</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell>{phieuxuat.npp.ma}</TableCell>
                            <TableCell>{phieuxuat.npp.ten}</TableCell>
                            <TableCell>{phieuxuat.npp.sdt}</TableCell>
                            <TableCell>
                                {ProvinceService.findByCode(phieuxuat.npp.tinh)?.name}
                            </TableCell>
                            <TableCell>{phieuxuat.npp.chietkhau * 100}%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Stack>
        </MainCard>
    );
}

export default ChinhSuaHoaDon;
