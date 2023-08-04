import {
    CreateNewFolderOutlined,
    DeleteOutline,
    RefreshOutlined,
    Visibility,
} from '@mui/icons-material';
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
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import quakhuyendungService from 'services/quakhuyendung.service';
import { Formik } from 'formik';
import { object } from 'yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import MainCard from 'ui-component/cards/MainCard';

const TangQua = () => {
    const [page, setPage] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [viewId, setViewId] = useState(null);
    const {
        data: allPhieus,
        isLoading,
        refetch,
    } = useQuery(
        ['getAllPhieuXuatQuaKD', page],
        () => quakhuyendungService.getAllPhieuXuatQuaKD(page),
        { initialData: [] }
    );
    const navigate = useNavigate();

    const navigateToCreatePhieu = () => {
        navigate('/qua/tang/create');
    };
    return (
        <MainCard
            title="Tặng quà"
            secondary={
                <Stack direction="row" spacing={1}>
                    <IconButton>
                        <RefreshOutlined />
                    </IconButton>

                    <Button
                        startIcon={<CreateNewFolderOutlined />}
                        variant="outlined"
                        onClick={navigateToCreatePhieu}
                    >
                        Thêm
                    </Button>
                </Stack>
            }
        >
            <DataGrid
                getRowId={(e) => e.ma}
                page={page}
                onPageChange={setPage}
                paginationMode="server"
                loading={isLoading}
                components={{
                    Toolbar: GridToolbar,
                }}
                columns={[
                    {
                        field: 'ma',
                        headerName: 'Mã',
                        flex: 0.5,
                    },
                    {
                        field: 'nguoinhap',
                        headerName: 'Người tạo',
                        flex: 1,
                        renderCell: ({ value }) => value.ten,
                    },
                    {
                        field: 'npp',
                        headerName: 'Nhà Phân Phối',
                        flex: 1,
                        renderCell: ({ value }) => value.ten,
                    },
                    { field: 'tongsl', headerName: 'Tổng số lượng', flex: 0.8 },
                    { field: 'tongdiem', headerName: 'Tổng điểm', flex: 0.8 },
                    {
                        field: 'actions',
                        headerName: 'Hành động',
                        flex: 1,
                        type: 'actions',
                        getActions({ row }) {
                            return [
                                <GridActionsCellItem
                                    icon={<Visibility />}
                                    key="view"
                                    label="Xem"
                                    onClick={() => setViewId(row.ma)}
                                />,
                                <GridActionsCellItem
                                    icon={<DeleteOutline />}
                                    key="delete"
                                    label="Xóa"
                                    onClick={() => setDeleteId(row.ma)}
                                />,
                            ];
                        },
                    },
                ]}
                rows={allPhieus?.data || []}
                rowCount={allPhieus?.total || 0}
                rowsPerPageOptions={['10']}
                pageSize={10}
                autoHeight
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            ></DataGrid>
            <DeleteModal
                deleteId={deleteId}
                onClose={() => {
                    setDeleteId(null);
                }}
                refetch={refetch}
            />
            {!!viewId && (
                <ViewPhieuModal open={!!viewId} ma={viewId} onClose={() => setViewId(null)} />
            )}
        </MainCard>
    );
};

const ViewPhieuModal = ({ open, onClose, ma }) => {
    const { data: phieu, isLoading } = useQuery(['getOnePhieuXuatQuaKD', ma], () =>
        quakhuyendungService.getOnePhieuXuatQuaKD(ma)
    );
    if (isLoading) return <LinearProgress />;
    console.log(phieu);
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontStyle: 'bold', fontSize: '24px' }}>
                    Phiếu Xuất Quà Khuyến Dùng #{ma}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ fontWeight: '500', fontStyle: 'bold', fontSize: '16px' }}>
                    Thông tin
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ngày Xuất</TableCell>
                            <TableCell>Nhà Phân Phối</TableCell>
                            <TableCell>Tổng Điểm</TableCell>
                            <TableCell>Người Lập</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{dayjs(phieu.ngayxuat).format('DD/MM/YYYY')}</TableCell>
                            <TableCell>{phieu.npp.ten}</TableCell>
                            <TableCell>{phieu.tongdiem}</TableCell>
                            <TableCell>{phieu.nguoinhap.ten}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div style={{ marginTop: '12px' }}>
                    <Typography sx={{ fontWeight: '500', fontStyle: 'bold', fontSize: '16px' }}>
                        Chi Tiết
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Quà</TableCell>
                                <TableCell>Số lượng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(phieu.chitiets || []).map((chitiet) => (
                                <TableRow key={chitiet.ma}>
                                    <TableCell>{chitiet.qua.ten}</TableCell>
                                    <TableCell>{chitiet.soluong}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const DeleteModal = ({ deleteId, onClose, refetch }) => {
    const submit = async () => {
        try {
            const data = await quakhuyendungService.xoaPhieuXuatQuaKD(deleteId);
            alert(data.message);
            refetch();
            onClose();
        } catch (error) {
            alert(error?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };
    return (
        <Dialog open={!!deleteId} onClose={onClose}>
            <Formik
                onSubmit={submit}
                initialValues={{ accept: false }}
                validationSchema={object().shape({
                    accept: Yup.bool().equals([true], 'Vui lòng xác nhận để xóa hóa đơn'),
                })}
            >
                {({ values, handleChange, errors, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <DialogTitle>Xác nhận xóa phiếu tặng quà khuyến dùng này?</DialogTitle>
                            <DialogContentText>
                                Sau khi xóa, phiếu tặng này sẽ không thể phục hồi, bạn có chắc chắn
                                muốn xóa không
                            </DialogContentText>
                            <FormControlLabel
                                onChange={handleChange}
                                control={<Checkbox />}
                                value={values.accept}
                                name="accept"
                                label="Xác nhận xóa hóa đơn này"
                            ></FormControlLabel>
                            <FormHelperText error>{errors.accept}</FormHelperText>
                            <DialogActions>
                                <Button type="submit" variant="contained">
                                    Xóa
                                </Button>
                                <Button type="button" onClick={() => onClose()}>
                                    Hủy
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};
export default TangQua;
