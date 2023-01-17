import { AddCircle, Delete, Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
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
    TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconFileUpload } from '@tabler/icons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import formatter from 'views/utilities/formatter';
import * as Yup from 'yup';

const CreateModal = ({ open, onClose, onSubmit }) => {
    const [donviList, setDonViList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAddDonvi = () =>
        setDonViList((prev) => [...prev, { id: Math.random(), ten: '', gianhap: 0, giaban: 0 }]);

    const handleRemoveDonvi = (id) => {
        setDonViList((prev) => prev.filter((e) => e.id !== id));
    };

    const handleUpdateDonvi = (values) => {
        for (const id in values) {
            const payload = values[id];

            const update = {};

            for (const key in payload) {
                update[key] = payload[key].value;
            }

            setDonViList((prev) =>
                prev.map((e) => {
                    if (e.id === Number(id)) {
                        return { ...e, ...update };
                    }

                    return e;
                })
            );
        }
    };

    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <Formik
                initialValues={{ ten: '' }}
                validationSchema={Yup.object().shape({
                    ten: Yup.string().required('Vui lòng nhập tên loại hàng'),
                })}
                onSubmit={async (values) => {
                    setLoading(true);
                    await onSubmit(values, donviList);
                    setLoading(false);
                    onClose();
                }}
            >
                {({ values, errors, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Thêm loại hàng</DialogTitle>

                        <DialogContent>
                            <TextField
                                sx={{ mt: 2 }}
                                fullWidth
                                name="ten"
                                value={values.ten}
                                error={!!errors.ten}
                                placeholder="Yến sào Sanest"
                                label="Tên loại hàng"
                                onChange={handleChange}
                            />
                            <FormHelperText error>{errors.ten}</FormHelperText>
                            <CardHeader
                                title="Đơn vị"
                                action={
                                    <LoadingButton
                                        startIcon={<AddCircle />}
                                        variant="contained"
                                        size="small"
                                        loading={loading}
                                        onClick={handleAddDonvi}
                                    >
                                        Thêm
                                    </LoadingButton>
                                }
                            />
                            <DataGrid
                                sx={{ height: 300 }}
                                density="compact"
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                columns={[
                                    {
                                        field: 'ten',
                                        headerName: 'Tên đơn vị',
                                        flex: 1,
                                        editable: true,
                                    },
                                    {
                                        field: 'gianhap',
                                        headerName: 'Giá nhập',
                                        flex: 1,
                                        editable: true,
                                        type: 'number',
                                        renderCell({ value }) {
                                            return formatter.format(value);
                                        },
                                    },
                                    {
                                        field: 'giaban',
                                        headerName: 'Giá bán',
                                        flex: 1,
                                        editable: true,
                                        type: 'number',
                                        renderCell({ value }) {
                                            return formatter.format(value);
                                        },
                                    },
                                    {
                                        field: 'actions',
                                        type: 'actions',
                                        headerName: 'Hành động',
                                        getActions(params) {
                                            return [
                                                <GridActionsCellItem
                                                    icon={<Delete />}
                                                    label="delete"
                                                    onClick={() => handleRemoveDonvi(params.row.id)}
                                                />,
                                            ];
                                        },
                                    },
                                ]}
                                rows={donviList}
                                editMode="row"
                                onEditRowsModelChange={handleUpdateDonvi}
                                loading={loading}
                                hideFooterPagination
                            />
                        </DialogContent>

                        <DialogActions>
                            <LoadingButton type="submit" variant="contained" loading={loading}>
                                Thêm
                            </LoadingButton>
                            <LoadingButton type="button" loading={loading} onClick={onClose}>
                                Hủy
                            </LoadingButton>
                        </DialogActions>
                    </form>
                )}
            </Formik>
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

    const {
        data: lhList,
        isLoading,
        refetch,
    } = useQuery([], () => productcategoryservice.getAllCategories());

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleOpenDeleteModal = (payload) => setDeletePayload(payload);
    const handleCloseDeleteModal = () => setDeletePayload(null);

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

    const handleDelete = async () => {
        try {
            await productcategoryservice.deleteCategory(deletePayload.ma);
        } catch (error) {
        } finally {
            handleCloseDeleteModal();
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
                                        onClick={() => {}}
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
        </Box>
    );
}

export default Category;
