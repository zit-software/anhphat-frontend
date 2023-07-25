import { AddCircle, Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    CardHeader,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    TextField,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, viVN } from '@mui/x-data-grid';
import { Formik } from 'formik';
import { useState } from 'react';
import formatter from 'views/utilities/formatter';
import * as Yup from 'yup';

function ProductCategoryForm({ value = { donvi: [] }, title, onSubmit, onClose }) {
    const [donviList, setDonViList] = useState(
        value.donvi.map((e) => ({
            ...e,
            id: e.ma,
            notDeleteable: true,
        }))
    );
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
        <Formik
            initialValues={{ ten: value.ten, ma: value.ma }}
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
                    <DialogTitle>{title}</DialogTitle>

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
                                    field: 'diem',
                                    headerName: 'Điểm',
                                    editable: true,
                                    type: 'number',
                                },
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    headerName: 'Hành động',
                                    getActions(params) {
                                        if (params.row.notDeleteable) return [];

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
                            Lưu
                        </LoadingButton>
                        <LoadingButton type="button" loading={loading} onClick={onClose}>
                            Hủy
                        </LoadingButton>
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
}

export default ProductCategoryForm;
