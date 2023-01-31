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
    Tooltip,
} from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import khuyenmaitangService from 'services/khuyenmaitang.service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { IconFilePlus } from '@tabler/icons';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { set } from 'date-fns';
import { useSelector } from 'react-redux';
const { default: MainCard } = require('ui-component/cards/MainCard');

const KhuyenMaiTang = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    if (!currentUser.laAdmin) navigate('/');
    const { data: allKMT, refetch } = useQuery('getAllKMT', khuyenmaitangService.getAllKMT);
    const [deleteID, setDeleteId] = useState(null);
    const handleDelete = async () => {
        await khuyenmaitangService.xoakmt(deleteID);
        refetch();
        setDeleteId(null);
    };

    const columns = [
        {
            field: 'ma',
            headerName: 'Mã',
            flex: 0.2,
        },
        {
            field: 'ten',
            headerName: 'Tên',
            flex: 1,
        },
        {
            field: 'updatedAt',
            headerName: 'Cập Nhật Lần Cuối',
            flex: 0.6,
            renderCell: (params) => dayjs(params.row.updatedAt).format('DD-MM-YYYY'),
        },
        {
            field: 'view',
            headerName: '',
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            navigate({
                                pathname: '/quantri/khuyenmai/tang/edit',
                                search: createSearchParams({
                                    type: 'view',
                                    ma: params.row.ma,
                                }).toString(),
                            });
                        }}
                    >
                        <VisibilityIcon color="primary" />
                    </IconButton>
                );
            },
        },
        {
            field: 'edit',
            headerName: '',
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            navigate({
                                pathname: '/quantri/khuyenmai/tang/edit',
                                search: createSearchParams({
                                    type: 'edit',
                                    ma: params.row.ma,
                                }).toString(),
                            });
                        }}
                    >
                        <EditIcon color="info" />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '',
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            setDeleteId(params.row.ma);
                        }}
                    >
                        <DeleteIcon color="error" />
                    </IconButton>
                );
            },
        },
    ];

    const arrs = allKMT || [];
    const rows = arrs.map((kmt) => ({ ...kmt, id: kmt.ma }));
    return (
        <MainCard
            title="Các Khuyến Mãi Tặng"
            secondary={
                <Tooltip title="Tạo khuyến mãi">
                    <IconButton
                        onClick={() => {
                            navigate({
                                pathname: '/quantri/khuyenmai/tang/edit',
                                search: createSearchParams({
                                    type: 'add',
                                }).toString(),
                            });
                        }}
                    >
                        <IconFilePlus />
                    </IconButton>
                </Tooltip>
            }
        >
            <div style={{ height: '60vh' }}>
                <DataGrid
                    autoPageSize
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    columns={columns}
                    rows={rows}
                    density="compact"
                />
            </div>
            <Dialog open={deleteID !== null} onClose={() => setDeleteId(null)}>
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
                            <DialogTitle>Xóa khuyến mãi tặng</DialogTitle>
                            <DialogContent>
                                <DialogContentText maxWidth={360}>
                                    Bạn có chắc chắn muốn xóa khuyến mãi tặng này không?
                                </DialogContentText>

                                <FormControlLabel
                                    label="Xác nhận xóa khuyến mãi giảm"
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
};

export default KhuyenMaiTang;
