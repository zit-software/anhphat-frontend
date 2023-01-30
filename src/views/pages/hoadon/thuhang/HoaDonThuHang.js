import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
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
import NppService from 'services/npp.service';
import dayjs from 'utils/dayjs';

const TaoHoaDonModal = ({ open, onClose }) => {
    const { data: npps } = useQuery(['npp'], () => NppService.layTatCa().then((res) => res.data));
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    const fixedNpps = npps?.data || [];

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tạo hóa đơn thu hàng</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        ngaynhap: new Date(),
                        manpp: '',
                    }}
                    validationSchema={Yup.object().shape({
                        ngaynhap: Yup.date().required('Vui lòng chọn ngày nhập'),
                        manpp: Yup.number().required('Vui lòng chọn nhà phân phối'),
                    })}
                    onSubmit={async (values) => {
                        try {
                            const data = await (
                                await HoaDonNhapService.taoHoaDon({
                                    ...values,
                                    mauser: currentUser.ma,
                                })
                            ).data;
                            navigate(`/hoadon/thuhang/${data.ma}`);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    {({ values, errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
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

const HoaDonThuHang = () => {
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
        HoaDonNhapService.layHoaDonThuHang({ page, limit: rowsPerPage, daluu: JSON.parse(daluu) })
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
            title="Hóa đơn thu hàng"
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
                            field: 'npp',
                            headerName: 'Nhà phân phối',
                            flex: 2,
                            renderCell({ value }) {
                                return value.ten;
                            },
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
                                        onClick={() => navigate(`/hoadon/thuhang/${params.row.ma}`)}
                                        size="small"
                                    />,
                                    <GridActionsCellItem
                                        color="error"
                                        icon={<Delete />}
                                        label="Xóa"
                                        onClick={() => setSelectedDelete(params.row.ma)}
                                        size="small"
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

export default HoaDonThuHang;
