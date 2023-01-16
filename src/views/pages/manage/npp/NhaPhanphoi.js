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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { IconCirclePlus, IconPencil, IconX } from '@tabler/icons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import NppService from 'services/npp.service';
import ProvinceService from 'services/province.service';
import MainCard from 'ui-component/cards/MainCard';
import RowSkeleton from 'ui-component/skeletons/RowSkeleton';
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
        isLoading,
        refetch,
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

    return (
        <MainCard
            title="Quản lý nhà phân phối"
            secondary={
                <Button startIcon={<IconCirclePlus />} onClick={handleOpenCreateModal}>
                    Thêm{' '}
                </Button>
            }
        >
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã nhà phân phối</TableCell>
                        <TableCell>Tên nhà phân phối</TableCell>
                        <TableCell>Chiết khấu</TableCell>
                        <TableCell>Số điện thoại</TableCell>
                        <TableCell>Tỉnh / Thành phố</TableCell>
                        <TableCell>Tạo vào</TableCell>
                        <TableCell>Chỉnh sửa lần cuối</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {isLoading ? (
                        <React.Fragment>
                            <RowSkeleton cols={9} />
                            <RowSkeleton cols={9} />
                            <RowSkeleton cols={9} />
                            <RowSkeleton cols={9} />
                            <RowSkeleton cols={9} />
                            <RowSkeleton cols={9} />
                            <RowSkeleton cols={9} />
                        </React.Fragment>
                    ) : (
                        fixedNpps.map((npp) => (
                            <TableRow key={npp.ma}>
                                <TableCell>{npp.ma}</TableCell>
                                <TableCell>{npp.ten}</TableCell>
                                <TableCell>{npp.chietkhau * 100}%</TableCell>
                                <TableCell>{npp.sdt}</TableCell>
                                <TableCell>{ProvinceService.findByCode(npp.tinh)?.name}</TableCell>
                                <TableCell>{dayjs(npp.createdAt).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{dayjs(npp.updatedAt).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenUpdateModal(npp)}>
                                        <IconPencil />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => setDeleteId(npp.ma)}>
                                        <IconX />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

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
