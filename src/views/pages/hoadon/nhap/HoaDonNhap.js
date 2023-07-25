import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    Tab,
    Tabs,
    TextField,
    Tooltip,
} from '@mui/material';
import { IconFilePlus, IconGitPullRequestClosed, IconGitPullRequestDraft } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import HoaDonNhapService from 'services/hoadonnhap.service';
import MainCard from 'ui-component/cards/MainCard';

import { Delete, Edit, Visibility } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'utils/dayjs';

const TaoHoaDonModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tạo hóa đơn nhập</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        nguon: 'Công ty',
                        nguoigiao: '',
                        ngaynhap: new Date(),
                    }}
                    validationSchema={Yup.object().shape({
                        nguon: Yup.string().required('Vui lòng nhập nguồn nhập hàng'),
                        ngaynhap: Yup.date().required('Vui lòng chọn ngày nhập'),
                        nguoigiao: Yup.string().required('Vui lòng nhập tên người giao'),
                    })}
                    onSubmit={async (values) => {
                        try {
                            const data = await (
                                await HoaDonNhapService.taoHoaDon({
                                    ...values,
                                    mauser: currentUser.ma,
                                })
                            ).data;
                            navigate(`/hoadon/nhap/${data.ma}`);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    {({ values, errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                                <Grid xs={12} item>
                                    <TextField
                                        fullWidth
                                        label="Nguồn"
                                        placeholder="Nguồn"
                                        name="nguon"
                                        value={values.nguon}
                                        error={!!errors.nguon}
                                        onChange={handleChange}
                                    />

                                    <FormHelperText error>{errors.nguon}</FormHelperText>
                                </Grid>

                                <Grid xs={12} item>
                                    <TextField
                                        fullWidth
                                        label="Người giao"
                                        placeholder="Người giao"
                                        name="nguoigiao"
                                        value={values.nguoigiao}
                                        error={!!errors.nguoigiao}
                                        onChange={handleChange}
                                    />

                                    <FormHelperText error>{errors.nguoigiao}</FormHelperText>
                                </Grid>
                                <Grid xs={12} item>
                                    <DatePicker
                                        inputFormat="DD/MM/YY"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.ngaynhap}
                                                fullWidth
                                            />
                                        )}
                                        value={values.ngaynhap}
                                        name="ngaynhap"
                                        label="Ngày nhập"
                                        onChange={(value) => {
                                            handleChange({
                                                target: {
                                                    name: 'ngaynhap',
                                                    value: value?.$d,
                                                },
                                            });
                                        }}
                                    />
                                    <FormHelperText error>{errors.ngaynhap}</FormHelperText>
                                </Grid>
                            </Grid>

                            <Divider />

                            <Button type="submit">Tạo</Button>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

const HoaDonNhap = () => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowPerPage] = useState(10);
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const daluu = JSON.parse(searchParams.get('daluu') || 'false');

    const {
        data: phieunhap,
        isLoading,
        refetch,
    } = useQuery(['phieunhap', page, rowsPerPage, daluu], () =>
        HoaDonNhapService.getAll({ page, limit: rowsPerPage, daluu: JSON.parse(daluu) })
    );

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleDelete = async () => {
        await HoaDonNhapService.xoa(selectedDelete);
        refetch();
        setSelectedDelete(null);
    };

    const fixedPhieuNhap = phieunhap || {
        data: [],
        total: 0,
    };

    return (
        <MainCard
            title="Hóa đơn nhập"
            secondary={
                <Tooltip title="Tạo hóa đơn">
                    <IconButton onClick={handleOpen}>
                        <IconFilePlus />
                    </IconButton>
                </Tooltip>
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
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    density="compact"
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    loading={isLoading}
                    paginationMode="server"
                    rowCount={fixedPhieuNhap.total}
                    initialState={{
                        pagination: {
                            page,
                            pageSize: rowsPerPage,
                        },
                    }}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    onPageChange={setPage}
                    onPageSizeChange={setRowPerPage}
                    columns={[
                        {
                            field: 'ma',
                            headerName: 'Mã phiếu',
                            flex: 1,
                        },
                        {
                            field: 'nguoinhap',
                            headerName: 'Người tạo',
                            renderCell({ value }) {
                                return value.ten;
                            },
                            flex: 2,
                        },
                        {
                            field: 'nguon',
                            headerName: 'Nguồn',
                            flex: 2,
                        },
                        {
                            field: 'nguoigiao',
                            headerName: 'Người giao',
                            flex: 2,
                        },
                        {
                            field: 'ngaynhap',
                            headerName: 'Ngày nhập',
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                            flex: 2,
                        },
                        {
                            field: 'createdAt',
                            headerName: 'Ngày tạo',
                            renderCell({ value }) {
                                return dayjs(value).format('DD/MM/YYYY');
                            },
                            flex: 2,
                        },
                        {
                            field: 'updatedAt',
                            headerName: 'Chỉnh sửa lần cuối',
                            renderCell({ value }) {
                                return dayjs(value).format('HH:MM, DD/MM/YYYY');
                            },
                            flex: 2,
                        },

                        {
                            field: 'actions',
                            headerName: 'Hành động',
                            type: 'actions',
                            getActions(params) {
                                return [
                                    <GridActionsCellItem
                                        icon={params.row.daluu ? <Visibility /> : <Edit />}
                                        label="Chỉnh sửa"
                                        onClick={() => navigate(`/hoadon/nhap/${params.row.ma}`)}
                                    />,
                                    <GridActionsCellItem
                                        color="error"
                                        icon={<Delete />}
                                        label="Xóa"
                                        onClick={() => setSelectedDelete(params.row.ma)}
                                    />,
                                ];
                            },
                            flex: 2,
                        },
                    ]}
                    rows={fixedPhieuNhap.data.map((e) => ({
                        ...e,
                        id: e.ma,
                    }))}
                />
            </div>

            <TaoHoaDonModal open={open} onClose={handleClose} />

            <Dialog open={!!selectedDelete} onClose={() => setSelectedDelete(null)}>
                <Formik
                    initialValues={{ accept: false }}
                    validationSchema={Yup.object().shape({
                        accept: Yup.bool().equals([true], 'Vui lòng xác nhận để xóa hóa đơn'),
                    })}
                    onSubmit={handleDelete}
                >
                    {({ values, handleChange, errors, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle>Xóa hóa đơn</DialogTitle>
                            <DialogContent sx={{ maxWidth: 360 }}>
                                <DialogContentText>
                                    Bạn chắc chắn muốn xóa hóa đơn này?
                                </DialogContentText>
                                <DialogContentText>
                                    Điều này có thể ảnh hưởng tới các mặt hàng cũng như dữ liệu
                                    thống kê của cửa hàng.
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
                                <Button type="button" onClick={() => setSelectedDelete(null)}>
                                    Hủy
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </MainCard>
    );
};

export default HoaDonNhap;
