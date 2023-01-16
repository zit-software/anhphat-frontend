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
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconCirclePlus, IconPencil, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import dayjs from 'dayjs';
import NppService from 'services/npp.service';
import ProvinceService from 'services/province.service';
import MainCard from 'ui-component/cards/MainCard';
import ManageNppForm from '../manage-forms/ManageNppForm';

const CreateModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>Thêm nhà phân phối</DialogTitle>
            <DialogContent>
                <ManageNppForm onSubmit={onSubmit} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
};

const UpdateModal = ({ value, open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>Thêm nhà phân phối</DialogTitle>
            <DialogContent>
                <ManageNppForm
                    value={value || {}}
                    buttonText="Lưu"
                    onSubmit={onSubmit}
                    onClose={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};

function NhaPhanPhoi() {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [updatePayload, setUpdatePayload] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleOpenUpdateModal = (value) => setUpdatePayload(value);
    const handleCloseUpdateModal = () => setUpdatePayload(null);

    const {
        data: npps,
        refetch,
        isLoading,
    } = useQuery(['npp'], () => NppService.layTatCa().then((res) => res.data));

    const handleCreate = async (values) => {
        try {
            await NppService.them(values);
        } catch (error) {
        } finally {
            refetch();
            handleCloseCreateModal();
        }
    };

    const handleUpdate = async (values) => {
        try {
            await NppService.capnhat(updatePayload.ma, values);
        } catch (error) {
        } finally {
            handleCloseUpdateModal();
            refetch();
        }
    };

    const handleDelete = async () => {
        try {
            await NppService.xoa(deleteId);
        } catch (error) {
        } finally {
            setDeleteId(null);
            refetch();
        }
    };

    const fixedNpps = npps?.data || [];
    const columns = [
        {
            field: 'ma',
            headerName: 'Mã nhà phân phối',
            flex: 1,
        },
        {
            field: 'ten',
            headerName: 'Tên nhà phân phối',
            flex: 2,
        },
        {
            field: 'sdt',
            headerName: 'Số điện thoại',
            flex: 2,
        },
        {
            field: 'chietkhau',
            headerName: 'Chiết khấu',
            flex: 2,
            renderCell: (params) => `${params.row.chietkhau * 100}%`,
        },
        {
            field: 'diem',
            headerName: 'Điểm',
            flex: 2,
        },
        {
            field: 'tinh',
            headerName: 'Tỉnh / thành phố',
            flex: 2,
            renderCell: (params) => ProvinceService.findByCode(params.row.tinh)?.name,
        },
        {
            field: 'createdAt',
            headerName: 'Tạo vào',
            flex: 2,
            renderCell: (params) => dayjs(params.row.createdAt).format('DD/MM/YYYY'),
        },
        {
            field: 'updatedAt',
            headerName: 'Chỉnh sửa lần cuối',
            flex: 2,
            renderCell: (params) => dayjs(params.row.updatedAt).format('DD/MM/YYYY'),
        },
        {
            field: 'edit',
            headerName: '',
            flex: 1,
            renderCell(params) {
                return (
                    <IconButton onClick={() => handleOpenUpdateModal(params.row)}>
                        <IconPencil />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '',
            flex: 1,
            renderCell(params) {
                return (
                    <IconButton onClick={() => setDeleteId(params.row.ma)}>
                        <IconX />
                    </IconButton>
                );
            },
        },
    ];

    const rows = fixedNpps.map((e) => ({
        ...e,
        id: e.ma,
    }));

    return (
        <MainCard
            title="Quản lý nhà phân phối"
            secondary={
                <Button startIcon={<IconCirclePlus />} onClick={handleOpenCreateModal}>
                    Thêm{' '}
                </Button>
            }
        >
            <div style={{ height: '60vh' }}>
                <DataGrid
                    autoPageSize
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    columns={columns}
                    rows={rows}
                    density="compact"
                    loading={isLoading}
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
                            <DialogTitle>Xóa nhà phân phối</DialogTitle>
                            <DialogContent>
                                <DialogContentText maxWidth={360}>
                                    Việc xóa nhà phân phối có thể ảnh hưởng tới dữ liệu của hệ
                                    thống, vui lòng cân nhắc điều này
                                </DialogContentText>

                                <FormControlLabel
                                    label="Xác nhận xóa nhà phân phối"
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
}

export default NhaPhanPhoi;
