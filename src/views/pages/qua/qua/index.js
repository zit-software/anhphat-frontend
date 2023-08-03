import {
    AddOutlined,
    DeleteOutline,
    EditOutlined,
    RefreshOutlined,
    SearchRounded,
} from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress,
    TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import QuaKhuyenDungForm from 'forms/QuaKhuyenDungForm';
import useDelay from 'hooks/useDelay';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import quakhuyendungService from 'services/quakhuyendung.service';
import MainCard from 'ui-component/cards/MainCard';

const KhoQua = () => {
    const [creating, setCreating] = useState(false);
    const [editPayload, setEditPayload] = useState(null);
    const [deletePayload, setDeletePayload] = useState(null);

    const [page, setPage] = useState(0);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [search, setSearch] = useState('');
    const delayedKeyword = useDelay(search);

    const handleCreate = async (values) => {
        try {
            await quakhuyendungService.create(values);
            toast.success('Tạo quà thành công');
            setCreating(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            refetchListQua();
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await quakhuyendungService.delete(deletePayload.ma);
            setDeletePayload(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsDeleting(false);
            refetchListQua();
        }
    };

    const handleUpdate = async (values) => {
        try {
            setIsUpdating(true);

            await quakhuyendungService.update(editPayload.ma, values);
            toast.success('Cập nhật quà thành công');
            setEditPayload(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const {
        data: listQua,
        isLoading: isLoadingListQua,
        refetch: refetchListQua,
    } = useQuery(['qua', page, delayedKeyword], () =>
        quakhuyendungService.getAll({ ten: delayedKeyword }, page)
    );

    return (
        <>
            <MainCard
                title="Kho Quà"
                secondary={
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={refetchListQua}>
                            <RefreshOutlined />
                        </IconButton>

                        <Button
                            variant="outlined"
                            startIcon={<AddOutlined />}
                            onClick={() => setCreating(true)}
                        >
                            Thêm quà
                        </Button>
                    </Stack>
                }
            >
                <Grid sx={{ marginBottom: '12px' }} container alignItems="center">
                    <Grid xs={11} item>
                        <TextField
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(0);
                            }}
                            placeholder="Tìm kiếm quà theo tên"
                            size="small"
                            fullWidth
                        ></TextField>
                    </Grid>
                    <Grid xs={1} justifyContent="center" container>
                        <SearchRounded />
                    </Grid>
                </Grid>
                <DataGrid
                    getRowId={(e) => e.ma}
                    rows={listQua?.data || []}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã',
                            flex: 1,
                        },
                        {
                            field: 'ten',
                            headerName: 'Tên',
                            flex: 2,
                        },
                        {
                            field: 'diem',
                            headerName: 'Điểm quy đổi',
                            flex: 1,
                        },
                        {
                            field: 'soluong',
                            headerName: 'Tồn kho',
                            flex: 1,
                        },
                        {
                            field: 'createdAt',
                            headerName: 'Tạo vào',
                            flex: 2,
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
                            },
                        },
                        {
                            field: 'updatedAt',
                            headerName: 'Cập nhật vào',
                            flex: 2,
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
                            },
                        },
                        {
                            field: 'actions',
                            headerName: 'Hành động',
                            flex: 2,
                            type: 'actions',
                            getActions({ row }) {
                                return [
                                    <GridActionsCellItem
                                        icon={<EditOutlined />}
                                        key="edit"
                                        label="Chỉnh sửa"
                                        onClick={() => setEditPayload(row)}
                                    />,
                                    <GridActionsCellItem
                                        icon={<DeleteOutline />}
                                        key="delete"
                                        label="Xóa"
                                        onClick={() => setDeletePayload(row)}
                                    />,
                                ];
                            },
                        },
                    ]}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    loading={isLoadingListQua}
                    autoHeight
                    pageSize={10}
                    paginationMode="server"
                    page={page}
                    rowCount={listQua?.total || 0}
                    rowsPerPageOptions={[10]}
                    onPageChange={setPage}
                />
            </MainCard>

            <Dialog open={creating} anchor="right" onClose={() => setCreating(false)}>
                <DialogTitle>Thêm quà</DialogTitle>
                <DialogContent>
                    <QuaKhuyenDungForm
                        actions={
                            <Stack spacing={1}>
                                <Button type="submit" variant="contained">
                                    Tạo
                                </Button>

                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => setCreating(false)}
                                >
                                    Hủy
                                </Button>
                            </Stack>
                        }
                        onSubmit={handleCreate}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!deletePayload} onClose={() => setDeletePayload(null)}>
                <DialogTitle>Xóa quà</DialogTitle>

                <DialogContent>
                    {isDeleting && <LinearProgress />}
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa quà <strong>{deletePayload?.ten}</strong>?
                    </DialogContentText>

                    <ul>
                        <li>
                            <strong>Mã:</strong>

                            {deletePayload?.ma}
                        </li>

                        <li>
                            <strong>Tên:</strong>

                            {deletePayload?.ten}
                        </li>

                        <li>
                            <strong>Còn lại:</strong>

                            {deletePayload?.soluong}
                        </li>

                        <li>
                            <strong>Điểm quy đổi:</strong>
                            {deletePayload?.diem} điểm
                        </li>
                    </ul>

                    <DialogContentText>
                        <strong>Lưu ý:</strong> Quà sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDeletePayload(null)}>Hủy</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!editPayload} onClose={() => setEditPayload(null)}>
                <DialogTitle>Chỉnh sửa quà</DialogTitle>

                <DialogContent>
                    {isUpdating && <LinearProgress />}
                    {editPayload ? (
                        <QuaKhuyenDungForm
                            actions={
                                <Stack spacing={1}>
                                    <Button type="submit" variant="contained">
                                        Cập nhật
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={() => setEditPayload(null)}
                                    >
                                        Hủy
                                    </Button>
                                </Stack>
                            }
                            onSubmit={handleUpdate}
                            initialValue={editPayload}
                        />
                    ) : (
                        <LinearProgress />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default KhoQua;
