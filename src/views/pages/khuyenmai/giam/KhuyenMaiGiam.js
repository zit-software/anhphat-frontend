import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    IconButton,
} from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import { IconCirclePlus, IconPencil, IconX } from '@tabler/icons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import khuyenmaigiamService from 'services/khuyenmaigiam.service';
import MainCard from 'ui-component/cards/MainCard';
import * as Yup from 'yup';
import KMGForm from './KMGForm';

const CreateModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>Thêm khuyến mãi giảm</DialogTitle>
            <DialogContent>
                <KMGForm onSubmit={onSubmit} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
};

const UpdateModal = ({ value, open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>Chỉnh sửa khyến mãi giảm</DialogTitle>
            <DialogContent>
                <KMGForm
                    value={value || {}}
                    buttonText="Lưu"
                    onSubmit={onSubmit}
                    onClose={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};

const KhuyenMaiGiam = () => {
    let { data, isLoading, refetch } = useQuery('allKMG', () => khuyenmaigiamService.getAllKMG());
    data = data || [];
    const columns = [
        {
            field: 'ma',
            headerName: 'Mã Khuyến Mãi',
            flex: 0.2,
        },
        {
            field: 'ten',
            headerName: 'Tên Khuyến Mãi',
            flex: 1,
        },
        {
            field: 'tile',
            headerName: 'Tỉ Lệ Giảm (%)',
            flex: 1,
            renderCell: (params) => `${params.row.tile * 100}%`,
        },
        {
            field: 'updatedAt',
            headerName: 'Chỉnh sửa lần cuối',
            renderCell(params) {
                return dayjs(params.row.updatedAt).format('HH:MM, DD/MM/YYYY');
            },
            flex: 2,
        },
        {
            field: 'edit',
            headerName: '',
            renderCell(params) {
                return (
                    <IconButton
                        onClick={() => {
                            console.log(params.row);
                            handleOpenUpdateModal(params.row);
                        }}
                        size="small"
                    >
                        <IconPencil />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '',
            renderCell(params) {
                return (
                    <IconButton onClick={() => setDeleteId(params.row.ma)} size="small">
                        <IconX />
                    </IconButton>
                );
            },
        },
    ];
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [updatePayload, setUpdatePayload] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleOpenUpdateModal = (value) => setUpdatePayload(value);
    const handleCloseUpdateModal = () => setUpdatePayload(null);

    const handleCreate = async (values) => {
        try {
            await khuyenmaigiamService.themKMG(values);
        } catch (error) {
        } finally {
            refetch();
            handleCloseCreateModal();
        }
    };

    const handleUpdate = async (values) => {
        try {
            await khuyenmaigiamService.capnhat(updatePayload.ma, values);
        } catch (error) {
        } finally {
            handleCloseUpdateModal();
            refetch();
        }
    };

    const handleDelete = async () => {
        try {
            await khuyenmaigiamService.xoaKMG(deleteId);
        } catch (error) {
        } finally {
            setDeleteId(null);
            refetch();
        }
    };

    return (
        <MainCard
            title="Các Khuyến Mãi Giảm"
            secondary={
                <Button startIcon={<IconCirclePlus />} onClick={handleOpenCreateModal}>
                    Thêm{' '}
                </Button>
            }
        >
            <div style={{ height: '60vh' }}>
                <DataGrid
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    density="compact"
                    loading={isLoading}
                    columns={columns}
                    rows={data.map((kmg) => ({
                        id: kmg.ma,
                        ...kmg,
                    }))}
                />
            </div>
            <CreateModal
                open={openCreateModal}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreate}
            />

            <UpdateModal
                open={!!updatePayload}
                value={updatePayload}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdate}
            />

            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <Formik
                    initialValues={{
                        accept: false,
                    }}
                    validationSchema={Yup.object().shape({
                        accept: Yup.boolean().equals([true], 'Vui lòng xác nhận để xóa'),
                    })}
                    onSubmit={handleDelete}
                >
                    {({ values, errors, handleSubmit, handleChange }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle>Xóa khuyến mãi giảm</DialogTitle>
                            <DialogContent>
                                <DialogContentText maxWidth={360}>
                                    Bạn có chắc chắn muốn xóa khuyến mãi giảm này không?
                                </DialogContentText>

                                <FormControlLabel
                                    label="Xác nhận xóa khuyến mãi giảm"
                                    name="accept"
                                    value={values.accept}
                                    control={<Checkbox />}
                                    onChange={handleChange}
                                />

                                <FormHelperText error>{errors.accept}</FormHelperText>
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit">Xóa</Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </MainCard>
    );
};

export default KhuyenMaiGiam;
