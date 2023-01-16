// material-ui

// project imports
import { Delete, Edit } from '@mui/icons-material';
import {
    AppBar,
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
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconUserPlus, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import usernamangeService from 'services/usermanage.service';
import MainCard from 'ui-component/cards/MainCard';

import ManageUserForm from '../manage-forms/ManageUserForm';

const DeleteAccountModal = ({ open, onClose, accountName, onSubmit }) => (
    <Dialog open={open} onClose={onClose}>
        <Formik
            validateOnMount
            initialValues={{
                accept: false,
            }}
            validationSchema={Yup.object().shape({
                accept: Yup.bool().required().equals([true], 'Vui lòng xác nhận hành động này'),
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Xóa tài khoản</DialogTitle>
                    <DialogContent sx={{ maxWidth: 360 }}>
                        <DialogContentText>
                            Bạn muốn xóa tài khoản <strong>{accountName}</strong>?
                        </DialogContentText>

                        <DialogContentText>
                            Việc này có thể làm ảnh hưởng đến dữ liệu của hệ thống mà người dùng này
                            đã tạo
                        </DialogContentText>

                        <FormControlLabel
                            value={values.accept}
                            name="accept"
                            onChange={handleChange}
                            label="Xác nhận xóa tài khoản"
                            control={<Checkbox />}
                        />

                        <FormHelperText error>{errors.accept}</FormHelperText>
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button color="error" type="submit">
                            Xóa
                        </Button>
                    </DialogActions>
                </form>
            )}
        </Formik>
    </Dialog>
);

const EditAccountModal = ({ open, user, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
            <DialogContent>
                {open ? <ManageUserForm user={user} onSubmit={onSubmit} /> : <ManageUserForm />}
            </DialogContent>
        </Dialog>
    );
};

const CreateAccountModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <AppBar sx={{ position: 'relative' }} color="inherit">
                <Toolbar>
                    <IconButton edge="start" onClick={onClose}>
                        <IconX />
                    </IconButton>
                    <Typography sx={{ flex: 1 }}>Tạo tài khoản</Typography>
                </Toolbar>
            </AppBar>
            <DialogTitle>Tạo tài khoản</DialogTitle>
            <DialogContent>
                {open && <ManageUserForm requiredPassword onSubmit={onSubmit} buttonText="Tạo" />}
            </DialogContent>
        </Dialog>
    );
};

const Accounts = () => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteAccountIndex, setDeleteAccountIndex] = useState(0);
    const [editAccount, setEditAccount] = useState(null);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    const {
        data: accounts,
        isLoading,
        refetch,
    } = useQuery(['userList'], () => usernamangeService.getAllUsers());

    const handleOpenDeleteDialog = (index) => {
        setShowDeleteDialog(true);
        setDeleteAccountIndex(index);
    };

    const handleCloseDeleteDialog = () => setShowDeleteDialog(false);

    const handleDeleteAccount = async () => {
        try {
            await usernamangeService.deleteAccount(accounts[deleteAccountIndex].ma);

            await refetch();

            handleCloseDeleteDialog();
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleCloseEditAccount = () => setEditAccount(null);

    const handleSubmitEditForm = async (values) => {
        try {
            Object.keys(values).forEach((key) => {
                if (values[key] === null) delete values[key];
            });
            await usernamangeService.updateAccount(editAccount.ma, values);
            await refetch();
            handleCloseEditAccount();
        } catch (error) {}
    };

    const handleCloseCreateModal = () => setShowCreateAccount(false);
    const handleOpenCreateModal = () => setShowCreateAccount(true);

    const handleCreateAccount = async (values) => {
        try {
            values.matkhau = values.mk;
            await usernamangeService.createAccount(values);
            await refetch();
            handleCloseCreateModal();
        } catch (error) {}
    };

    const fixedAccounts = accounts || [];

    return (
        <MainCard
            title="Tài khoản"
            secondary={
                <Tooltip title="Tạo tài khoản">
                    <IconButton onClick={handleOpenCreateModal}>
                        <IconUserPlus />
                    </IconButton>
                </Tooltip>
            }
        >
            <div style={{ height: '60vh' }}>
                <DataGrid
                    columns={[
                        { field: 'ma', headerName: 'Mã số', flex: 1 },
                        { field: 'ten', headerName: 'Tên tài khoản', flex: 2 },
                        { field: 'sdt', headerName: 'Số điện thoại', flex: 2 },
                        { field: 'laAdmin', headerName: 'Quyền', flex: 2 },
                        { field: 'createdAt', headerName: 'Tạo vào', flex: 2 },
                        { field: 'updatedAt', headerName: 'Chỉnh sửa lần cuối', flex: 2 },
                        {
                            field: 'actions',
                            type: 'actions',
                            headerName: 'Hành động',
                            flex: 2,
                            getActions(props) {
                                return [
                                    <GridActionsCellItem
                                        icon={<Edit />}
                                        label="Chỉnh sửa"
                                        onClick={() => setEditAccount(props.row)}
                                    />,
                                    <GridActionsCellItem
                                        color="error"
                                        icon={<Delete />}
                                        label="Xóa"
                                        onClick={() => handleOpenDeleteDialog(props.row.index)}
                                    />,
                                ];
                            },
                        },
                    ]}
                    rows={fixedAccounts.map((e, index) => ({
                        ...e,
                        id: e.ma,
                        index,
                    }))}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    density="compact"
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    autoPageSize
                    loading={isLoading}
                />
            </div>
            <DeleteAccountModal
                open={showDeleteDialog}
                onClose={handleCloseDeleteDialog}
                accountName={fixedAccounts[deleteAccountIndex]?.name}
                onSubmit={handleDeleteAccount}
            />

            <EditAccountModal
                open={!!editAccount}
                user={editAccount}
                onClose={handleCloseEditAccount}
                onSubmit={handleSubmitEditForm}
            />

            <CreateAccountModal
                open={showCreateAccount}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreateAccount}
            />
        </MainCard>
    );
};

export default Accounts;
