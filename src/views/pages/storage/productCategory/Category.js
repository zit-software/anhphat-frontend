import { Delete, Edit } from '@mui/icons-material';
import {
    Button,
    CardHeader,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    IconButton,
    LinearProgress,
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconFileUpload } from '@tabler/icons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import * as Yup from 'yup';
import ProductCategoryForm from '../forms/ProductCategotyForm';

const CreateModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth title="Thêm hàng hóa" open={open} onClose={onClose}>
            {open && <ProductCategoryForm onSubmit={onSubmit} onClose={onClose} />}
        </Dialog>
    );
};

const UpdateModal = ({ value, open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth title="Chỉnh sửa loại hàng" open={open} onClose={onClose}>
            {value && <ProductCategoryForm value={value} onSubmit={onSubmit} onClose={onClose} />}
        </Dialog>
    );
};

const DeleteModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Formik
                initialValues={{ accept: false }}
                validationSchema={Yup.object().shape({
                    accept: Yup.bool().equals([true], 'Vui lòng xác nhận để xóa hàng hóa'),
                })}
                onSubmit={onSubmit}
            >
                {({ values, handleChange, errors, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Xóa loại hàng</DialogTitle>
                        <DialogContent sx={{ maxWidth: 360 }}>
                            <DialogContentText>
                                Bạn chắc chắn muốn xóa hàng hóa này này?
                            </DialogContentText>
                            <DialogContentText>
                                Điều này có thể ảnh hưởng tới các mặt hàng cũng như dữ liệu thống kê
                                của cửa hàng.
                            </DialogContentText>

                            <FormControlLabel
                                label="Xác nhận xóa hàng hóa này"
                                name="accept"
                                value={values.accept}
                                control={<Checkbox />}
                                onChange={handleChange}
                            />

                            <FormHelperText error>{errors.accept}</FormHelperText>
                        </DialogContent>

                        <DialogActions>
                            <Button type="submit" variant="contained">
                                Xóa
                            </Button>
                            <Button type="button" onClick={onClose}>
                                Hủy
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

function Category() {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [deletePayload, setDeletePayload] = useState(null);
    const [updatePayload, setUpdatePayload] = useState(null);

    const {
        data: lhList,
        isLoading,
        refetch,
    } = useQuery([], () => productcategoryservice.getAllCategoriesAndDonvi());

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleCreate = async (values, donviList) => {
        try {
            const resLh = await productcategoryservice.addCategory(values);

            for (const donviItem of donviList) {
                await productcategoryservice.addDonvi({
                    malh: resLh.ma,
                    ...donviItem,
                });
            }
        } catch (error) {
        } finally {
            refetch();
        }
    };

    const handleOpenDeleteModal = (payload) => setDeletePayload(payload);
    const handleCloseDeleteModal = () => setDeletePayload(null);

    const handleDelete = async () => {
        try {
            await productcategoryservice.deleteCategory(deletePayload.ma);
        } catch (error) {
        } finally {
            handleCloseDeleteModal();
            refetch();
        }
    };

    const handleOpenUpdateModal = (payload) => setUpdatePayload(payload);
    const handleCloseUpdateModal = () => setUpdatePayload(null);

    const handleUpdate = async (values, donviList) => {
        try {
            await productcategoryservice.updateCategory(values, values.ma);

            for (const donvi of donviList) {
                if (donvi.ma) {
                    await productcategoryservice.updateDonVi(donvi.ma, donvi);
                } else {
                    await productcategoryservice.addDonvi({ ...donvi, malh: values.ma });
                }
            }
        } catch (error) {
        } finally {
            handleCloseUpdateModal();
            refetch();
        }
    };

    if (isLoading) return <LinearProgress />;

    return (
        <Box>
            <CardHeader
                title="Loại hàng"
                action={
                    <IconButton onClick={handleOpenCreateModal}>
                        <IconFileUpload />
                    </IconButton>
                }
            />

            <Box sx={{ height: '60vh' }}>
                <DataGrid
                    rows={lhList.map((e) => ({
                        ...e,
                        id: e.ma,
                    }))}
                    columns={[
                        { field: 'ma', headerName: 'Mã loại hàng' },
                        { field: 'ten', headerName: 'Tên loại hàng', flex: 1 },
                        {
                            field: 'createdAt',
                            headerName: 'Ngày tạo',
                            flex: 1,
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                        },
                        {
                            field: 'updatedAt',
                            headerName: 'Chỉnh sửa lần cuối',
                            flex: 1,
                            renderCell({ value }) {
                                return dayjs(value).format('HH:MM, DD/MM/YYYY');
                            },
                        },
                        {
                            field: 'actions',
                            headerName: 'Hành động',
                            type: 'actions',
                            flex: 1,
                            getActions(params) {
                                return [
                                    <GridActionsCellItem
                                        icon={<Edit />}
                                        label="Chỉnh sửa"
                                        onClick={() => handleOpenUpdateModal(params.row)}
                                    />,
                                    <GridActionsCellItem
                                        icon={<Delete />}
                                        label="Xóa"
                                        onClick={() => handleOpenDeleteModal(params.row)}
                                    />,
                                ];
                            },
                        },
                    ]}
                    hideFooterPagination
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    density="compact"
                />
            </Box>
            <CreateModal
                open={openCreateModal}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreate}
            />

            <DeleteModal
                open={!!deletePayload}
                onClose={handleCloseDeleteModal}
                onSubmit={handleDelete}
            />

            <UpdateModal
                open={!!updatePayload}
                value={updatePayload}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdate}
            />
        </Box>
    );
}

export default Category;
