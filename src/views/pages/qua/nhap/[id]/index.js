import { InfoOutlined } from '@mui/icons-material';
import {
    Divider,
    Drawer,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import GiftDetailsModal from 'components/GiftDetailsModal';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import quakhuyendungService from 'services/quakhuyendung.service';
import formatter from 'views/utilities/formatter';

const ChitietPhieuNhap = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { data: phieunhap, isLoading: isLoadingPhieunhap } = useQuery(['qua/kho', { id }], () =>
        quakhuyendungService.getPhieuNhapById(id)
    );

    const handleClose = () => {
        navigate('/qua/nhap');
    };

    const [giftDetails, setGiftDetails] = useState(null);

    return (
        <>
            <Drawer open anchor="right" onClose={handleClose}>
                <Stack spacing={1} p={2} sx={{ width: 900, maxWidth: '100%' }}>
                    <Typography variant="h3" fontWeight={900}>
                        Thông tin nhập quà
                    </Typography>

                    <Divider />

                    {isLoadingPhieunhap && <LinearProgress />}

                    {phieunhap && (
                        <Paper variant="outlined" sx={{ p: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Người nhập</TableCell>
                                        <TableCell>Ngày nhập</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {phieunhap.nguoinhap.ten} ({phieunhap.nguoinhap.ma})
                                        </TableCell>

                                        <TableCell>
                                            {dayjs(phieunhap.ngaynhap).format(
                                                'DD/MM/YYYY, HH:mm:ss'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Typography variant="h4" my={2}>
                                Chi tiết
                            </Typography>

                            <Table>
                                <TableHead>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Giá nhập</TableCell>
                                    <TableCell>Thành tiền</TableCell>
                                    <TableCell>Chi tiết</TableCell>
                                </TableHead>

                                <TableBody>
                                    {phieunhap.chitiets.map((ct, index) => (
                                        <TableRow key={ct.ma}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{ct.qua.ma}</TableCell>
                                            <TableCell>{ct.qua.ten}</TableCell>
                                            <TableCell>{ct.soluong}</TableCell>
                                            <TableCell>{formatter.format(ct.gia)}</TableCell>
                                            <TableCell>
                                                {formatter.format(ct.gia * ct.soluong)}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setGiftDetails(ct.qua)}
                                                >
                                                    <InfoOutlined />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell colSpan={3}>Tổng cộng</TableCell>

                                        <TableCell colSpan={1}>{phieunhap.tongsl}</TableCell>
                                        <TableCell colSpan={2}>
                                            {formatter.format(phieunhap.tongtien)}
                                        </TableCell>
                                        <TableCell colSpan={1}></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </Stack>
            </Drawer>

            <GiftDetailsModal
                open={!!giftDetails}
                payload={giftDetails}
                onClose={() => setGiftDetails(null)}
            />
        </>
    );
};

export default ChitietPhieuNhap;
