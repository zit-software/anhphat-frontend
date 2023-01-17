import { Delete, Edit } from '@mui/icons-material';
import {
    Button,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { IconEqual, IconFileUpload, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { memo, useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import productcategoryservice from 'services/productcategory.service';

// INPUT MODAL
const _InputModal = ({ open, onClose, onSubmit }) => {
    const [selectedloaihang, setselectedloaihang] = useState('');

    const { data: donvis } = useQuery(
        [open, selectedloaihang],
        productcategoryservice.getAllDonVisByLoaiHang,
        {
            initialData: [],
            enabled: !!selectedloaihang,
        }
    );
    const { data: categories } = useQuery(
        'allProductsCategoryAddQuyCach',
        productcategoryservice.getAllCategories,
        {
            initialData: [],
        }
    );
    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <Formik
                initialValues={{ malh: '', madv1: '', madv2: '', soluong: 0 }}
                validationSchema={Yup.object().shape({
                    malh: Yup.number().required('Vui lòng chọn loại hàng'),
                    madv1: Yup.number().required('Vui lòng chọn đơn vị lớn'),
                    madv2: Yup.number().required('Vui lòng chọn đơn vị nhỏ'),
                    soluong: Yup.number()
                        .required('Vui lòng nhập số lượng')
                        .integer('Số lượng phải là số nguyên')
                        .min(1, 'Số lượng phải > 0'),
                })}
                onSubmit={onSubmit}
            >
                {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Thêm quy cách</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 1 }} error={!!errors.malh}>
                                <InputLabel>Loại hàng</InputLabel>
                                <Select
                                    name="malh"
                                    value={values.malh}
                                    label="Loại hàng"
                                    placeholder="Loại hàng"
                                    onChange={(event) => {
                                        handleChange(event);
                                        setFieldValue('madv1', '');
                                        setFieldValue('madv2', '');
                                        setselectedloaihang(event.target.value);
                                    }}
                                >
                                    {categories.map((e) => (
                                        <MenuItem key={e.ma} value={e.ma}>
                                            {e.ten}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <FormHelperText error>{errors.malh}</FormHelperText>
                            </FormControl>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={3}>
                                    <FormControl fullWidth error={!!errors.madv1}>
                                        <InputLabel>Đơn vị lớn</InputLabel>
                                        <Select
                                            name="madv1"
                                            value={values.madv1}
                                            label="Đơn vị lớn"
                                            placeholder="Đơn vị lớn"
                                            onChange={handleChange}
                                        >
                                            {donvis
                                                .filter(() => values.malh)
                                                .map((e) => (
                                                    <MenuItem key={e.ma} value={e.ma}>
                                                        {e.ten}
                                                    </MenuItem>
                                                ))}
                                        </Select>

                                        <FormHelperText error>{errors.madv1}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={1}>
                                    <IconButton disabled>
                                        <IconEqual />
                                    </IconButton>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth error={!!errors.madv2}>
                                        <InputLabel>Đơn vị nhỏ</InputLabel>
                                        <Select
                                            name="madv2"
                                            value={values.madv2}
                                            label="Đơn vị nhỏ"
                                            placeholder="Đơn vị nhỏ"
                                            onChange={handleChange}
                                        >
                                            {donvis
                                                .filter((e) => e.ma !== values.madv1 && values.malh)
                                                .map((e) => (
                                                    <MenuItem key={e.ma} value={e.ma}>
                                                        {e.ten}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                        <FormHelperText error>{errors.madv2}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton disabled>
                                        <IconX />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        error={!!errors.soluong}
                                        fullWidth
                                        label="Số lượng quy đổi"
                                        type="number"
                                        placeholder="12"
                                        name="soluong"
                                        value={values.soluong}
                                        onChange={handleChange}
                                    />

                                    <FormHelperText error>{errors.soluong}</FormHelperText>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" variant="contained">
                                Lưu
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

const InputModal = memo(_InputModal);

const QuyCach = () => {
    // State là mã của quy cách đang chỉnh sửa, nếu đang không chỉnh sửa thì state là null

    const { data: quycachs, refetch: refetchAllQuyCachs } = useQuery(
        'allQuyCachs',
        productcategoryservice.getAllQuyCachs,
        { initialData: [] }
    );

    const { data: products } = useQuery([], productcategoryservice.getAllCategoriesAndDonvi);

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

    return (
        <>
            <CardHeader
                title="Quy cách"
                action={
                    <IconButton onClick={handleOpenInputModal}>
                        <IconFileUpload />
                    </IconButton>
                }
            />

            <DataGrid
                sx={{ height: '60vh' }}
                columns={[
                    {
                        field: 'ma',
                        headerName: 'Mã',
                    },
                    {
                        field: 'lh',
                        headerName: 'Loại hàng',
                        flex: 1,
                        renderCell({ value }) {
                            return value.ten;
                        },
                    },
                    {
                        field: 'dv1',
                        headerName: 'Đơn vị lớn',
                        flex: 1,
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
                        flex: 1,
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
                                    onClick={() => {}}
                                />,

                                <GridActionsCellItem
                                    icon={<Delete />}
                                    label="Xóa"
                                    onClick={() => {}}
                                />,
                            ];
                        },
                    },
                ]}
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
        </>
    );
};

export default QuyCach;
