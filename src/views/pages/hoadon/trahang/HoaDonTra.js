import { Delete, Edit, Visibility } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { DatePicker } from '@mui/x-date-pickers';
import { IconFileUpload, IconGitPullRequestClosed, IconGitPullRequestDraft } from '@tabler/icons';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import HoaDonXuatService from 'services/hoadonxuat.service';
import NppService from 'services/npp.service';
import MainCard from 'ui-component/cards/MainCard';
import { useSearchParams } from 'react-router-dom';

const CreateModal = ({ open, onClose, onSubmit }) => {
    const { data: npps, isLoading } = useQuery(['npp'], () =>
        NppService.layTatCa().then((res) => res.data)
    );

    const currentUser = useSelector((state) => state.auth.user);

    const fixedNpps = npps?.data || [];

    if (isLoading) return <LinearProgress />;

    return (
        <Dialog open={open} onClose={onClose}>
            <Formik
                initialValues={{
                    manpp: '',
                    ngayxuat: new Date(),
                    mauser: currentUser.ma,
                }}
                validationSchema={Yup.object().shape({
                    manpp: Yup.string().required('Vui lòng chọn nhà phân phối'),
                    ngayxuat: Yup.date('Ngày xuất không đúng định dạng').required(
                        'Vui lòng chọn ngày xuất'
                    ),
                })}
                onSubmit={onSubmit}
            >
                {({ values, errors, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit} style={{ width: 360 }}>
                        <DialogTitle>Tạo hóa đơn xuất</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Nhà phân phối</InputLabel>
                                <Select
                                    value={values.manpp}
                                    fullWidth
                                    label="Nhà phân phối"
                                    placeholder="Nhà phân phối"
                                    name="manpp"
                                    onChange={handleChange}
                                >
                                    {fixedNpps.map((npp) => (
                                        <MenuItem key={npp.ma} value={npp.ma}>
                                            {npp.ten}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <FormHelperText error>{errors.manpp}</FormHelperText>
                            </FormControl>

                            <DatePicker
                                value={values.ngayxuat}
                                inputFormat="DD/MM/YYYY"
                                label="Ngày xuất"
                                renderInput={(props) => (
                                    <TextField
                                        sx={{ mt: 2 }}
                                        placeholder="Ngày xuất"
                                        name="ngayxuat"
                                        {...props}
                                        fullWidth
                                    />
                                )}
                                onChange={(value) =>
                                    handleChange({
                                        target: {
                                            name: 'ngayxuat',
                                            value: value?.$d,
                                        },
                                    })
                                }
                            />

                            <FormHelperText error>{errors.ngayxuat}</FormHelperText>
                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" variant="contained">
                                Tạo
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

const DeleteModal = ({ open, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Formik
                initialValues={{ accept: false }}
                validationSchema={Yup.object().shape({
                    accept: Yup.bool().equals([true], 'Vui lòng xác nhận để xóa hóa đơn'),
                })}
                onSubmit={onSubmit}
            >
                {({ values, handleChange, errors, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Xóa hóa đơn</DialogTitle>
                        <DialogContent sx={{ maxWidth: 360 }}>
                            <DialogContentText>
                                Bạn chắc chắn muốn xóa hóa đơn này?
                            </DialogContentText>
                            <DialogContentText>
                                Điều này có thể ảnh hưởng tới các mặt hàng cũng như dữ liệu thống kê
                                của cửa hàng.
                            </DialogContentText>

                            <FormControlLabel
                                label="Xác nhận xóa hóa đơn này"
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

function HoaDonXuat() {
    const navigate = useNavigate();

    // pagination
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deletePayload, setDeletePayload] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const daluu = JSON.parse(searchParams.get('daluu') || 'false');

    const {
        data: phieuxuat,
        isLoading,
        refetch,
    } = useQuery([page, limit, daluu], () =>
        HoaDonXuatService.layTatCa({ page, limit, daluu }).then((res) => res.data)
    );

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const handleCreate = async (values) => {
        try {
            const res = await HoaDonXuatService.taoHoaDon(values);

            navigate(`/hoadon/xuat/${res.data.ma}`);
        } catch (error) {
        } finally {
            handleCloseCreateModal();
        }
    };

    const handleOpenDeleteModal = (payload) => setDeletePayload(payload);
    const handleCloseDeleteModal = () => setDeletePayload(null);

    const handleDelete = async () => {
        try {
            await HoaDonXuatService.xoaHoaDon(deletePayload.ma);
            refetch();
        } catch (error) {
        } finally {
            handleCloseDeleteModal();
        }
    };

    const fixedPhieuXuat = phieuxuat || { data: [], total: 0 };

    return (
        <MainCard
            title="Quản lý hóa đơn xuất"
            secondary={
                <Button
                    variant="outlined"
                    startIcon={<IconFileUpload />}
                    onClick={handleOpenCreateModal}
                >
                    Tạo
                </Button>
            }
        >
            <Tabs
                value={JSON.stringify(daluu)}
                onChange={(_, daluu) =>
                    setSearchParams({
                        daluu,
                    })
                }
            >
                <Tab
                    value="false"
                    label="Chưa lưu"
                    icon={<IconGitPullRequestDraft size={20} />}
                    iconPosition="start"
                />
                <Tab
                    value="true"
                    label="Đã lưu"
                    icon={<IconGitPullRequestClosed size={20} />}
                    iconPosition="start"
                />
            </Tabs>
            <div style={{ height: '60vh' }}>
                <DataGrid
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    rows={fixedPhieuXuat.data.map((e) => ({
                        ...e,
                        id: e.ma,
                    }))}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã số phiếu',
                        },
                        {
                            field: 'nguoinhap',
                            headerName: 'Người tạo',
                            flex: 1,
                            renderCell({ value }) {
                                return value.ten;
                            },
                        },
                        {
                            field: 'npp',
                            headerName: 'Nhà phân phối',
                            flex: 1,
                            renderCell({ value }) {
                                return value.ten;
                            },
                        },
                        {
                            field: 'ngayxuat',
                            headerName: 'Ngày xuất',
                            flex: 1,
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                        },
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
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                        },
                        {
                            field: 'actions',
                            type: 'actions',
                            headerName: 'Hành động',
                            getActions(params) {
                                return [
                                    <GridActionsCellItem
                                        label="Chỉnh sửa"
                                        icon={params.row.daluu ? <Visibility /> : <Edit />}
                                        onClick={() => navigate(`/hoadon/xuat/${params.row.ma}`)}
                                    />,
                                    <GridActionsCellItem
                                        label="Xóa"
                                        icon={<Delete />}
                                        onClick={() => handleOpenDeleteModal(params.row)}
                                    />,
                                ];
                            },
                            flex: 1,
                        },
                    ]}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    density="compact"
                    initialState={{
                        pagination: {
                            pageSize: limit,
                        },
                    }}
                    pageSize={limit}
                    page={page}
                    loading={isLoading}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    paginationMode="server"
                    rowCount={fixedPhieuXuat.total}
                    onPageChange={setPage}
                    onPageSizeChange={setLimit}
                />
            </div>

            <CreateModal
                open={showCreateModal}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreate}
            />

            <DeleteModal
                open={deletePayload !== null}
                onClose={handleCloseDeleteModal}
                onSubmit={handleDelete}
            />
        </MainCard>
    );
}

export default HoaDonXuat;
