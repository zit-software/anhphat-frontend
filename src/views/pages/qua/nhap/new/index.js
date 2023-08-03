import {
    AddBoxOutlined,
    DeleteOutline,
    DisabledByDefaultRounded,
    SaveOutlined,
} from '@mui/icons-material';
import {
    Button,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import InputNumber from 'ui-component/input-number';
import SelectGiftModal from './SelectGiftModal';

const NewNhapQua = () => {
    const [ngaynhap, setNgaynhap] = useState(new Date());

    const [isOpenSelectModal, setIsOpenSelectModal] = useState(false);

    const [selectedGift, setSelectedGift] = useState([]);

    const addSelectedGift = (payload) => {
        setSelectedGift((prev) => {
            const isExisted = prev.some((e) => e.ma === payload.ma);

            if (isExisted) {
                prev = [...prev].map((e) => {
                    if (e.ma === payload.ma) {
                        e.soluong += payload.soluong;
                    }

                    return e;
                });
            } else {
                prev = [...prev, { ...payload }];
            }

            return prev;
        });
    };

    const updateSelectedGift = (ma, payload) => {};

    const handleOpenSelectModal = () => setIsOpenSelectModal(true);
    const handleCloseSelectModal = () => setIsOpenSelectModal(false);

    return (
        <>
            <MainCard
                title="Nhập quà"
                secondary={
                    <Stack direction="row" spacing={2}>
                        <Link to={-1}>
                            <Button startIcon={<DisabledByDefaultRounded />}>Hủy</Button>
                        </Link>

                        <Button variant="contained" startIcon={<SaveOutlined />}>
                            Xác nhận
                        </Button>
                    </Stack>
                }
            >
                <Stack spacing={2}>
                    <DatePicker
                        value={ngaynhap}
                        renderInput={(props) => (
                            <TextField {...props} label="Ngày nhập" placeholder="Chọn ngày nhập" />
                        )}
                        inputFormat="DD/MM/YYYY"
                        onChange={setNgaynhap}
                    />

                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<AddBoxOutlined />}
                            onClick={handleOpenSelectModal}
                        >
                            Thêm quà
                        </Button>
                    </Box>

                    <Divider />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã quà</TableCell>

                                <TableCell>Tên quà</TableCell>

                                <TableCell>Số lượng</TableCell>

                                <TableCell>Xóa</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {selectedGift.map((gift, key) => (
                                <TableRow key={key}>
                                    <TableCell>{gift.ma}</TableCell>
                                    <TableCell>{gift.ten}</TableCell>
                                    <TableCell>
                                        <InputNumber
                                            placeholder="Số lượng"
                                            label="Số lượng"
                                            value={gift.soluong}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button startIcon={<DeleteOutline />}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Stack>
            </MainCard>

            <SelectGiftModal
                open={isOpenSelectModal}
                onClose={handleCloseSelectModal}
                onSelected={addSelectedGift}
            />
        </>
    );
};

export default NewNhapQua;
