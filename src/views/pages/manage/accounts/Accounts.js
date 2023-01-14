// material-ui

// project imports
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { IconPencil, IconShield, IconTrash, IconUser, IconUserPlus, IconX } from '@tabler/icons';
import { useState } from 'react';
import { useQuery } from 'react-query';

import usernamangeService from 'services/usermanage.service';
import MainCard from 'ui-component/cards/MainCard';

import dayjs from 'utils/dayjs';
import ManageUserForm from '../manage-forms/ManageUserForm';

const RowSkeletion = () => (
    <TableRow>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
    </TableRow>
);

const DeleteAccountModal = ({ open, onClose, accountName, onSubmit }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Xóa tài khoản</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Bạn muốn xóa tài khoản <strong>{accountName}</strong>?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button color="error" onClick={onSubmit}>
                Xóa
            </Button>
        </DialogActions>
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
        refetch
    } = useQuery(['userList'], () => usernamangeService.getAllUsers(), { initialData: [] });

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

    return (
        <MainCard
            title="Tài khoản"
            showBreadcrumbs
            secondary={
                <Tooltip title="Tạo tài khoản">
                    <IconButton onClick={handleOpenCreateModal}>
                        <IconUserPlus />
                    </IconButton>
                </Tooltip>
            }
        >
            <TableContainer sx={{ maxHeight: '70vh' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã số</TableCell>
                            <TableCell>Tên tài khoản</TableCell>
                            <TableCell>Quyền</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Chỉnh sửa lần cuối</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <RowSkeletion />
                                <RowSkeletion />
                                <RowSkeletion />
                                <RowSkeletion />
                                <RowSkeletion />
                            </>
                        ) : (
                            accounts.map((user, index) => (
                                <TableRow key={user.ma} hover>
                                    <TableCell>{user.ma}</TableCell>
                                    <TableCell>{user.ten}</TableCell>
                                    <TableCell>
                                        {user.laAdmin ? <IconShield /> : <IconUser />}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(user.createdAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(user.updatedAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton
                                                color="primary"
                                                onClick={() => setEditAccount(user)}
                                            >
                                                <IconPencil />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title="Xóa tài khoản"
                                            onClick={() => handleOpenDeleteDialog(index)}
                                        >
                                            <IconButton color="error">
                                                <IconTrash />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <DeleteAccountModal
                open={showDeleteDialog}
                onClose={handleCloseDeleteDialog}
                accountName={accounts[deleteAccountIndex]?.name}
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
