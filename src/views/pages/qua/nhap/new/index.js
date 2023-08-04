import {
    AddBoxOutlined,
    DeleteOutline,
    DisabledByDefaultRounded,
    SaveOutlined,
} from '@mui/icons-material';
import {
    Button,
    Divider,
    LinearProgress,
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
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import InputNumber from 'ui-component/input-number';
import SelectGiftModal from './SelectGiftModal';
import quakhuyendungService from 'services/quakhuyendung.service';
import dayjs from 'dayjs';

const NewNhapQua = () => {
    const [ngaynhap, setNgaynhap] = useState(new Date());
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

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

    const updateSelectedGift = (ma, payload) => {
        setSelectedGift((prev) => {
            prev = prev.map((e) => {
                if (e.ma === payload.ma) {
                    return { ...payload };
                }

                return e;
            });

            return [...prev];
        });
    };

    const deleteSelectedGift = (ma) => {
        setSelectedGift((prev) => [...prev.filter((e) => e.ma !== ma)]);
    };

    const handleOpenSelectModal = () => setIsOpenSelectModal(true);
    const handleCloseSelectModal = () => setIsOpenSelectModal(false);

    const handleSubmit = async () => {
        try {
            setIsSaving(true);

            await quakhuyendungService.createPhieuNhap({
                ngaynhap,
                chitiets: selectedGift,
            });

            toast.success('Nhập quà thành công');

            navigate(-1);
        } catch (error) {
            toast.error(error.response?.data.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <MainCard
                title="Nhập quà"
                secondary={
                    <Stack direction="row" spacing={2}>
                        <Link to={-1}>
                            <Button startIcon={<DisabledByDefaultRounded />}>Hủy</Button>
                        </Link>

                        <Button
                            variant="contained"
                            startIcon={<SaveOutlined />}
                            onClick={handleSubmit}
                        >
                            Lưu
                        </Button>
                    </Stack>
                }
            >
                <Stack spacing={2}>
                    {isSaving && <LinearProgress />}

                    <DatePicker
                        value={dayjs(ngaynhap)}
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

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã quà</TableCell>

                                <TableCell>Tên quà</TableCell>

                                <TableCell>Số lượng nhập</TableCell>

                                <TableCell>Điểm quy đổi</TableCell>

                                <TableCell>Xóa</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {selectedGift.map((gift) => (
                                <TableRow key={gift.ma}>
                                    <TableCell>{gift.ma}</TableCell>
                                    <TableCell>{gift.ten}</TableCell>
                                    <TableCell>
                                        <InputNumber
                                            placeholder="Số lượng"
                                            label="Số lượng"
                                            value={gift.soluong}
                                            onChange={({ target: { value } }) =>
                                                updateSelectedGift(gift.ma, {
                                                    ...gift,
                                                    soluong: value,
                                                })
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>{gift.diem}</TableCell>

                                    <TableCell>
                                        <Button
                                            color="error"
                                            variant="contained"
                                            startIcon={<DeleteOutline />}
                                            onClick={() => deleteSelectedGift(gift.ma)}
                                        >
                                            Xóa
                                        </Button>
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
