import { AddOutlined, DeleteOutline, RefreshRounded } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    LinearProgress,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import quakhuyendungService from 'services/quakhuyendung.service';
import MainCard from 'ui-component/cards/MainCard';

const DeleteModal = ({ payload, open, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await quakhuyendungService.deletePhieuNhapById(payload.ma);

            toast.success('Đã xóa phiếu nhập');
        } catch (error) {
            toast.error(error.response?.data.message);
        } finally {
            setIsDeleting(false);
            onClose?.();
        }
    };

    payload = payload || { nguoinhap: {} };

    const { nguoinhap } = payload;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xóa phiếu nhập quà</DialogTitle>

            <DialogContent>
                {isDeleting && <LinearProgress />}
                <DialogContentText>Bạn có chắc chắn muốn xóa phiếu nhập này?</DialogContentText>

                <DialogContentText>
                    <ul>
                        <li>Mã: {payload.ma}</li>

                        <li>
                            Người nhập:
                            <ul>
                                <li>Mã: {nguoinhap.ma}</li>
                                <li>Tên: {nguoinhap.ten}</li>
                            </ul>
                        </li>

                        <li>Ngày nhập: {dayjs(payload.ngaynhap).format('DD/MM/YYYY')}</li>
                    </ul>
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>

                <Button variant="contained" color="error" onClick={handleDelete}>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const NhapQuaPage = () => {
    const [page, setPage] = useState(0);
    const [deletePayload, setDeletePayload] = useState(null);

    const {
        data: listPhieuNhap,
        isLoading: isLoadingPhieuNhap,
        refetch: refetchPhieuNhap,
    } = useQuery(['qua/nhap', { page }], () => quakhuyendungService.getAllPhieuNhap(page));

    return (
        <>
            <MainCard
                title="Nhập quà"
                secondary={
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={refetchPhieuNhap}>
                            <RefreshRounded />
                        </IconButton>

                        <Link to="/qua/nhap/new">
                            <Button variant="outlined" startIcon={<AddOutlined />}>
                                Nhập
                            </Button>
                        </Link>
                    </Stack>
                }
            >
                <DataGrid
                    density="compact"
                    getRowId={(e) => e.ma}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã phiếu nhập',
                            flex: 1,
                        },
                        {
                            field: 'ngaynhap',
                            headerName: 'Ngày nhập',
                            flex: 2,
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                        },
                        {
                            field: 'nguoinhap',
                            headerName: 'Người nhập',
                            flex: 2,
                            renderCell({ value }) {
                                return `${value.ten} (${value.ma})`;
                            },
                        },
                        {
                            field: 'actions',
                            type: 'actions',
                            getActions({ row }) {
                                return [
                                    <GridActionsCellItem
                                        icon={<DeleteOutline />}
                                        key="delete"
                                        label="Delete"
                                        title="Delete"
                                        onClick={() => setDeletePayload(row)}
                                    />,
                                ];
                            },
                        },
                    ]}
                    autoHeight
                    rows={listPhieuNhap?.data || []}
                    loading={isLoadingPhieuNhap}
                    page={page}
                    pageSize={10}
                    rowCount={listPhieuNhap?.total || 0}
                    onPageChange={(page) => setPage(page)}
                />
            </MainCard>

            <DeleteModal
                open={!!deletePayload}
                onClose={() => {
                    setDeletePayload(null);
                    refetchPhieuNhap();
                }}
                payload={deletePayload}
            />
        </>
    );
};

export default NhapQuaPage;
