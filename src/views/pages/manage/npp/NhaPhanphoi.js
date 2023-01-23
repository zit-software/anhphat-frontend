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
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconCirclePlus } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import { Delete, Edit, Payment } from '@mui/icons-material';
import dayjs from 'dayjs';
import NppService from 'services/npp.service';
import ProvinceService from 'services/province.service';
import MainCard from 'ui-component/cards/MainCard';
import ManageNppForm from '../manage-forms/ManageNppForm';
import ManageNPPPointForm from '../manage-forms/ManageNppPointForm';
import LogDiem from './LogDiem';

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

const PointModal = ({ value, open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>Điểm nhà phân phối</DialogTitle>
            <DialogContent>
                <ManageNPPPointForm
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
    const [pointPayload, setPointPayload] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleOpenUpdateModal = (value) => setUpdatePayload(value);
    const handleOpenPointsModal = (value) =>
        setPointPayload({
            ...value,
            ghichu: '',
        });
    const handleClosePointsModal = () => setPointPayload(null);
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

    const handleUpdatePoint = async (values) => {
        try {
            const { ma: manpp, diem, ghichu } = values;
            await NppService.capnhatdiem(manpp, { diem, ghichu });
        } catch (error) {
        } finally {
            handleClosePointsModal();
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
            renderCell: ({ value }) => `${value * 100}%`,
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
            renderCell: ({ value }) => ProvinceService.findByCode(value)?.name,
        },
        {
            field: 'createdAt',
            headerName: 'Tạo vào',
            flex: 2,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'updatedAt',
            headerName: 'Chỉnh sửa lần cuối',
            flex: 2,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            getActions(params) {
                return [
                    <GridActionsCellItem
                        icon={<Payment />}
                        label="Điểm"
                        size="small"
                        onClick={() => {
                            handleOpenPointsModal(params.row);
                        }}
                    />,
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Chỉnh sửa"
                        size="small"
                        onClick={() => handleOpenUpdateModal(params.row)}
                    />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Xóa"
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(params.row.ma)}
                    />,
                ];
            },
            flex: 2,
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
            <div style={{ marginTop: '24px' }}>
                <LogDiem />
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
            <PointModal
                open={!!pointPayload}
                value={pointPayload}
                onClose={handleClosePointsModal}
                onSubmit={handleUpdatePoint}
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
