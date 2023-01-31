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
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconFileUpload } from '@tabler/icons';
import { Formik } from 'formik';
import { memo, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import productcategoryservice from 'services/productcategory.service';
import QuyCachForm from '../forms/QuyCachForm';
import * as Yup from 'yup';
// INPUT MODAL
const _InputModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <QuyCachForm onSubmit={onSubmit} onClose={onClose} />
        </Dialog>
    );
};

const InputModal = memo(_InputModal);

const UpdateModal = ({ open, value, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            {open && <QuyCachForm value={value} onClose={onClose} onSubmit={onSubmit} />}
        </Dialog>
    );
};

const QuyCach = () => {
    // State là mã của quy cách đang chỉnh sửa, nếu đang không chỉnh sửa thì state là null
    const [selectedDelete, setSelectedDelete] = useState(null);

    const { data: quycachs, refetch: refetchAllQuyCachs } = useQuery(
        'allQuyCachs',
        productcategoryservice.getAllQuyCachs,
        { initialData: [] }
    );

    const { data: products } = useQuery([], productcategoryservice.getAllCategoriesAndDonvi);

    const currentUser = useSelector((state) => state.auth.user);

    // THÊM QUY CÁCH
    const [openInputModal, setOpenInputModal] = useState(false);
    const handleOpenInputModal = () => {
        setOpenInputModal(true);
    };
    const handleCloseInputModal = () => {
        setOpenInputModal(false);
    };
    const handleSubmitInputModal = async (payload) => {
        try {
            await productcategoryservice.addQuyCach(payload);
            handleCloseInputModal();
        } catch (error) {
            console.log(error);
        } finally {
            refetchAllQuyCachs();
        }
    };

    // Update
    const [updatePayload, setUpdatePayload] = useState(null);

    const handleOpenUpdateModal = (payload) => setUpdatePayload(payload);
    const handleCloseUpdateModal = () => setUpdatePayload(null);

    const handleUpdate = async (values) => {
        try {
            await productcategoryservice.updateQuyCach(updatePayload.ma, values);
        } catch (error) {
        } finally {
            handleCloseUpdateModal();
            refetchAllQuyCachs();
        }
    };

    const handleDelete = async () => {
        await productcategoryservice.xoaQuyCach(selectedDelete);
        refetchAllQuyCachs();
    };

    return (
        <>
            <CardHeader
                title="Quy cách"
                action={
                    currentUser.laAdmin && (
                        <IconButton onClick={handleOpenInputModal}>
                            <IconFileUpload />
                        </IconButton>
                    )
                }
            />

            <DataGrid
                sx={{ height: '60vh' }}
                columns={[
                    {
                        field: 'lh',
                        headerName: 'Loại hàng',
                        flex: 0.7,
                        renderCell({ value }) {
                            return value.ten;
                        },
                    },
                    {
                        field: 'dv1',
                        headerName: 'Đơn vị lớn',
                        flex: 0.2,
                        renderCell({ value }) {
                            return value.ten;
                        },
                        renderEditCell({ value }) {
                            return (
                                <Select fullWidth value={value.ma}>
                                    {products.map((product) => (
                                        <MenuItem key={product.ma} value={product.ma}>
                                            {product.ten}
                                        </MenuItem>
                                    ))}
                                </Select>
                            );
                        },
                    },
                    {
                        field: 'dv2',
                        headerName: 'Đơn vị bé',
                        flex: 0.2,
                        renderCell({ value }) {
                            return value.ten;
                        },
                    },
                    {
                        field: 'soluong',
                        headerName: 'Số lượng quy đổi',
                    },
                    {
                        field: 'description',
                        headerName: 'Diễn giải',
                        flex: 1,
                        renderCell({ row }) {
                            return (
                                <Typography>
                                    1 {row.dv1.ten} {row.lh.ten} = {row.soluong} {row.dv2.ten}{' '}
                                    {row.lh.ten}
                                </Typography>
                            );
                        },
                    },
                    {
                        field: 'actions',
                        type: 'actions',
                        getActions({ row }) {
                            return [
                                <GridActionsCellItem
                                    icon={<Edit />}
                                    label="Chỉnh sửa"
                                    onClick={() => handleOpenUpdateModal(row)}
                                />,
                            ];
                        },
                    },
                    {
                        field: 'actions',
                        type: 'actions',
                        getActions({ row }) {
                            return [
                                <GridActionsCellItem
                                    icon={<Delete />}
                                    label="Xóa"
                                    onClick={() => {
                                        setSelectedDelete(row.ma);
                                    }}
                                />,
                            ];
                        },
                    },
                ]}
                columnVisibilityModel={{
                    actions: currentUser.laAdmin,
                }}
                rows={quycachs.map((e) => ({
                    ...e,
                    id: e.ma,
                }))}
                density="compact"
                hideFooter
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                components={{
                    Toolbar: GridToolbar,
                }}
            />

            <InputModal
                open={openInputModal}
                onClose={handleCloseInputModal}
                onSubmit={handleSubmitInputModal}
                refetch={refetchAllQuyCachs}
            />

            <UpdateModal
                value={updatePayload}
                open={!!updatePayload}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdate}
            />
            <Dialog open={!!selectedDelete} onClose={() => setSelectedDelete(null)}>
                <Formik
                    initialValues={{ accept: false }}
                    validationSchema={Yup.object().shape({
                        accept: Yup.bool().equals([true], 'Vui lòng xác nhận để xóa quy cách'),
                    })}
                    onSubmit={handleDelete}
                >
                    {({ values, handleChange, errors, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle>Xóa quy cách</DialogTitle>
                            <DialogContent sx={{ maxWidth: 360 }}>
                                <DialogContentText>
                                    Bạn chắc chắn muốn xóa quy cách này?
                                </DialogContentText>
                                <DialogContentText>
                                    Vui lòng kiểm tra lại trước khi xóa
                                </DialogContentText>

                                <FormControlLabel
                                    label="Xác nhận xóa quy cách này"
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
                                <Button type="button" onClick={() => setSelectedDelete(null)}>
                                    Hủy
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default QuyCach;
