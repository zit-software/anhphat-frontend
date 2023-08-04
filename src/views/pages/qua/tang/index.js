import {
    CreateNewFolderOutlined,
    DeleteOutline,
    RefreshOutlined,
    Visibility,
} from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import quakhuyendungService from 'services/quakhuyendung.service';
import MainCard from 'ui-component/cards/MainCard';

const TangQua = () => {
    const [page, setPage] = useState(0);
    const [deleteId, setDeleteId] = useState(null);

    const { data: allPhieus, isLoading } = useQuery(
        ['getAllPhieuXuatQuaKD', page],
        () => quakhuyendungService.getAllPhieuXuatQuaKD(page),
        { initialData: [] }
    );
    return (
        <MainCard
            title="Tặng quà"
            secondary={
                <Stack direction="row" spacing={1}>
                    <IconButton>
                        <RefreshOutlined />
                    </IconButton>

                    <Button startIcon={<CreateNewFolderOutlined />} variant="outlined">
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
            />
        </MainCard>
    );
};

export default TangQua;

const DeleteModal = ({ deleteId, onClose }) => {
    return (
        <Dialog open={!!deleteId} onClose={onClose}>
            <DialogTitle>Xác nhận xóa phiếu tặng quà khuyến dùng này?</DialogTitle>
            <DialogContent>Bạn có chắc chắn muốn xóa không?</DialogContent>
        </Dialog>
    );
};
