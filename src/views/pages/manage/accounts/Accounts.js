// material-ui

// project imports
import {
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
    Tooltip
} from '@mui/material';
import { IconPencil, IconShield, IconTrash, IconUser } from '@tabler/icons';
import { useState } from 'react';
import { useQuery } from 'react-query';

import usernamangeService from 'services/usermanage.service';
import MainCard from 'ui-component/cards/MainCard';
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

const Accounts = () => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteAccountIndex, setDeleteAccountIndex] = useState(0);
    const [editAccount, setEditAccount] = useState(null);
    const [refetchCount, setRefetchCount] = useState(0);

    const { data: accounts, isLoading } = useQuery(
        [refetchCount],
        () => usernamangeService.getAllUsers(),
        { initialData: [] }
    );

    const handleOpenDeleteDialog = (index) => {
        setShowDeleteDialog(true);
        setDeleteAccountIndex(index);
    };

    const handleCloseDeleteDialog = () => setShowDeleteDialog(false);

    const handleDeleteAccount = async () => {
        try {
            await usernamangeService.deleteAccount(accounts[deleteAccountIndex].ma);

            setRefetchCount(refetchCount + 1);
            handleCloseDeleteDialog();
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleCloseEditAccount = () => setEditAccount(null);

    const handleSubmitEditForm = async (values) => {
        try {
            await usernamangeService.updateAccount(editAccount.ma, values);
            setRefetchCount(refetchCount + 1);
            setEditAccount(null);
        } catch (error) {}
    };

    return (
        <MainCard title="Tài khoản">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã số</TableCell>
                            <TableCell>Tên tài khoản</TableCell>
                            <TableCell>Quyền</TableCell>
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
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => setEditAccount(user)}
                                            >
                                                <IconPencil color="blue" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title="Xóa tài khoản"
                                            onClick={() => handleOpenDeleteDialog(index)}
                                        >
                                            <IconButton aria-label="edit">
                                                <IconTrash color="red" />
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
        </MainCard>
    );
};

export default Accounts;
