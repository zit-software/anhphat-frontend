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

const Accounts = () => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteAccountIndex, setDeleteAccountIndex] = useState(0);
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
                                            <IconButton aria-label="edit">
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
        </MainCard>
    );
};

export default Accounts;
